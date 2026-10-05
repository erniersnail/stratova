"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidEmail } from "@/lib/validation/email";

/**
 * Newsletter state. Kept non-exported deliberately: a "use server" module
 * may only export async functions. Callers infer it via
 * `Parameters<typeof subscribeNewsletterAction>[0]`.
 */
type NewsletterState = {
  error?: string;
  success?: string;
  fields?: { email?: string };
};

/**
 * Subscribes an email to the newsletter. A duplicate address returns the
 * same success copy — never reveals whether an email is already subscribed.
 */
export async function subscribeNewsletterAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Please enter your email address.", fields: { email } };
  }
  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address.", fields: { email } };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("newsletter_signups")
    .insert({ email });

  if (error) {
    if ((error as { code?: string }).code === "23505") {
      return { success: "You're already on the list." };
    }
    return { error: "Could not subscribe. Please try again.", fields: { email } };
  }

  return { success: "You're on the list." };
}
