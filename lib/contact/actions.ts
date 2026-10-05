"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidEmail } from "@/lib/validation/email";

/**
 * Contact form state. Kept non-exported deliberately: a "use server" module
 * may only export async functions. Callers infer it via
 * `Parameters<typeof submitContactAction>[0]`.
 */
type ContactState = {
  error?: string;
  success?: string;
  fields?: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  };
};

/**
 * Persists a contact submission. Only (email, message) are stored — see
 * migration 0001. Name/company are collected for context in the UI and
 * validated, but have no column. DB errors are never leaked to the visitor.
 */
export async function submitContactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const fields = { name, email, company, message };

  if (!name) {
    return { error: "Please provide your name.", fields };
  }
  if (!email || !message) {
    return { error: "Please provide your email and a message.", fields };
  }
  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address.", fields };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_submissions")
    .insert({ email, message });

  if (error) {
    return {
      error: "Could not send. Please try again or email us directly.",
      fields,
    };
  }

  return { success: "Thanks — we'll be in touch." };
}
