"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TERMS_DOC_VERSION, type AuthState } from "@/lib/auth/constants";
import { getAuthErrorMessage } from "@/lib/auth/error-messages";
import { isValidEmail } from "@/lib/validation/email";

export type SubscribeState = {
  error?: string;
};

export type ProfileState = {
  error?: string;
  success?: string;
  fields?: { fullName?: string; phone?: string };
};

const MAX_ALLOCATION = 10000000;

/**
 * Signs a new user up.
 */
export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const consent = formData.get("consent");

  const fields = { email, fullName };

  if (!email || !password || !fullName) {
    return { error: "All fields are required.", fields };
  }
  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address.", fields };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", fields };
  }
  if (consent !== "on" && consent !== "true") {
    return { error: "You must agree to the Terms of Use and Privacy Policy.", fields };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: getAuthErrorMessage(error), fields };
  }

  if (data?.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "An account with this email already exists. Please sign in.", fields };
  }

  if (!data.session) {
    redirect("/signup/confirm");
  }

  const user = data.user;
  if (!user) {
    return { error: "Could not create your account. Please try again.", fields };
  }

  const headerList = await headers();

  await supabase.from("profiles").insert({ id: user.id, full_name: fullName });
  await supabase.from("consents").insert({
    user_id: user.id,
    doc_type: "terms",
    doc_version: TERMS_DOC_VERSION,
    ip: clientIp(headerList.get("x-forwarded-for")),
    user_agent: headerList.get("user-agent"),
  });

  revalidatePath("/", "layout");
  redirect("/account");
}

/** Signs a user in with email and password. */
export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fields = { email };

  if (!email || !password) {
    return { error: "Email and password are required.", fields };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: getAuthErrorMessage(error), fields };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

/** Signs a user out. */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** Updates the current user's profile. */
export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone })
    .eq("id", user.id);

  if (error) return { error: "Could not update profile." };

  revalidatePath("/account");
  return { success: "Profile updated." };
}

/** Subscribes the current user to a strategy via payment. */
export async function subscribeAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in to subscribe." };
  }

  const strategyId = String(formData.get("strategyId") ?? "");
  const cycleMonths = Number(formData.get("billingCycle")) || 1;
  // Strip commas and currency symbols from capital
  const capitalStr = String(formData.get("capital") ?? "0").replace(/[^0-9.]/g, '');
  const capital = Number(capitalStr);
  
  // Use the fee calculated directly on the client form (fixes the zero amount bug)
  const totalFee = Number(formData.get("fee") ?? 0);

  if (!totalFee || totalFee <= 0) {
    return { error: "Invalid payment amount. Please refresh and try again." };
  }

  const { data: strategy, error: strategyError } = await supabase
    .from("strategies")
    .select("id, slug, name, region")
    .eq("id", strategyId)
    .single();

  if (strategyError || !strategy) {
    return { error: "Strategy not found." };
  }

  const isUS =
    strategy.slug === "us-equity-leadership" ||
    strategy.id === "95ccee51-d817-4a61-9a5b-b4d1a9143e74";
    
  const minCapital = isUS ? 10000 : 100000;
  if (capital < minCapital) {
    return {
      error: `Minimum capital allocation is ${isUS ? "$10,000" : "₹1,00,000"}.`,
    };
  }
  if (capital > MAX_ALLOCATION) {
    return { error: "Maximum allocation is ₹1,00,00,000." };
  }

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("strategy_id", strategyId)
    .in("status", ["ACTIVE", "PENDING"])
    .limit(1);

  if (existing && existing.length > 0) {
    return { error: "You already have a subscription to this strategy." };
  }

  // Set the payment date to TODAY so they get immediate access
  const todayDate = new Date().toISOString().slice(0, 10);

  const { data: subData, error: subError } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      strategy_id: strategyId,
      status: "PENDING",
      plan: "Monthly",
      price: totalFee,
      capital_allocated: capital,
      started_at: null,
    })
    .select("id")
    .single();

  if (subError || !subData) {
    return { error: "Something went wrong. Please try again." };
  }

  const { data: payData, error: payError } = await supabase
    .from("subscription_payments")
    .insert({
      subscription_id: subData.id,
      rebalance_date: todayDate,
      amount: totalFee,
      status: "PENDING",
    })
    .select("id")
    .single();

  if (payError || !payData) {
    return { error: "Something went wrong. Please try again." };
  }

  redirect(`/checkout/${payData.id}`);
}

/** Sets the new password after following the reset link. */
export async function resetPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!password || !confirm) {
    return { error: "Enter your new password twice." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: getAuthErrorMessage(error) };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

/** Normalises a possibly comma-separated forwarded-for header for an inet column. */
function clientIp(raw: string | null): string | null {
  if (!raw) return null;
  const first = raw.split(",")[0].trim();
  return first.length > 0 ? first : null;
}

/** Performs password reset via email link. */
export async function forgotPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required.", fields: { email } };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "/auth/callback",
  });

  if (error) {
    return { error: getAuthErrorMessage(error) };
  }

  revalidatePath("/", "layout");
  redirect("/check-email");
}
