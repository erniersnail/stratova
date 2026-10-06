"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TERMS_DOC_VERSION, type AuthState } from "@/lib/auth/constants";
import { isValidEmail } from "@/lib/validation/email";

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
  if (message.includes("new password should be different")) {
    return "Choose a password you haven't used before.";
  }
  if (message.includes("auth session missing") || message.includes("invalid_grant")) {
    return "Your reset link has expired. Request a new one.";
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

// ── Profile editing ─────────────────────────────────────────────────────────

export type ProfileState = {
  error?: string;
  success?: string;
  fields?: { fullName?: string; phone?: string };
};

const PROFILE_UPDATED = "Profile updated.";

/**
 * Updates the current user's profile (full_name, phone). Email is never
 * editable here — it is owned by Supabase Auth.
 */
export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const fields = { fullName, phone };

  if (!fullName) {
    return { error: "Enter your full name.", fields };
  }

  if (phone && !/^\+?[0-9]{10,15}$/.test(phone)) {
    return { error: "Enter a valid phone number (10–15 digits).", fields };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Something went wrong. Please try again.", fields };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", user.id);

  if (error) {
    return { error: "Something went wrong. Please try again.", fields };
  }

  revalidatePath("/account");
  return { success: PROFILE_UPDATED, fields };
}

// ── Password reset ──────────────────────────────────────────────────────────

type ResetState = {
  error?: string;
  success?: string;
  fields?: { email?: string };
};

const RESET_LINK_SENT =
  "If an account exists for that email, you'll receive a reset link shortly.";

/**
 * Sends a password-reset email. Always returns the same success copy so the
 * caller can never learn whether the email belongs to an account.
 */
export async function forgotPasswordAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Please enter your email address.", fields: { email } };
  }
  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address.", fields: { email } };
  }

  const headerList = await headers();
  const forwardedHost =
    headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const origin = forwardedHost ? `${proto}://${forwardedHost}` : null;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    // Route through the callback so the ?code= is exchanged for a session
    // before /reset-password is reached. `next` selects the page after.
    origin ? { redirectTo: `${origin}/auth/callback?next=/reset-password` } : undefined,
  );

  if (error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("email rate limit") ||
      message.includes("rate limit")
    ) {
      return {
        error: "Too many attempts. Please wait a moment and try again.",
        fields: { email },
      };
    }
    if (message.includes("fetch") || message.includes("network")) {
      return {
        error: "Network error. Please check your connection and try again.",
        fields: { email },
      };
    }
    // Every other failure (including "user not found") resolves to the same
    // neutral copy — never reveal whether the email exists.
    return { success: RESET_LINK_SENT };
  }

  return { success: RESET_LINK_SENT };
}

/**
 * Sets the new password after following the reset link. Requires the session
 * established by the email link's code exchange.
 */
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
    return { error: authErrorMessage(error.message) };
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
