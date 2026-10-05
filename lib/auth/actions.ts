"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TERMS_DOC_VERSION, type AuthState } from "@/lib/auth/constants";

/** Maps a Supabase error into copy that never reveals whether an email exists. */
function authErrorMessage(raw: string): string {
  const message = raw.toLowerCase();

  if (message.includes("already registered") || message.includes("already been registered")) {
    return "An account already exists for that email. Try logging in instead.";
  }
  if (message.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (message.includes("password should be at least")) {
    return "Password must be at least 8 characters.";
  }
  if (message.includes("email rate limit") || message.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (message.includes("fetch") || message.includes("network")) {
    return "Network error. Please check your connection and try again.";
  }
  return "Something went wrong. Please try again.";
}

/**
 * Signs a new user up and joins them to the waitlist.
 *
 * Stratova is pre-launch: this creates an ACCOUNT and records consent. It does
 * not create a subscription and takes no payment.
 *
 * Profile and consent rows are written here when a session is available
 * immediately. When Supabase requires email confirmation there is no session
 * yet, so `ensureProfile` backfills both on the first authenticated visit
 * (using auth.users.created_at as the authoritative acceptance timestamp).
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
    return { error: authErrorMessage(error.message), fields };
  }

  // No session => Supabase requires email confirmation before sign-in.
  if (!data.session) {
    redirect("/signup/confirm");
  }

  const user = data.user;
  if (!user) {
    // signUp reported no error but returned neither a session nor a user.
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
    return { error: "Enter your email and password.", fields };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: authErrorMessage(error.message), fields };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

/** Signs the current user out and returns to the public home page. */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** Normalises a possibly comma-separated forwarded-for header for an inet column. */
function clientIp(raw: string | null): string | null {
  if (!raw) return null;
  const first = raw.split(",")[0].trim();
  return first.length > 0 ? first : null;
}
