import { headers } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { TERMS_DOC_VERSION } from "@/lib/auth/constants";

/**
 * Ensures a signed-in user has a `profiles` row and a `terms` consent row.
 *
 * Why this is needed: when Supabase requires email confirmation, the user has
 * no session at signup time, so the server action cannot write those rows under
 * RLS. This backfills them on the first authenticated visit instead.
 *
 * `accepted_at` uses auth.users.created_at — the moment the account was created
 * and the checkbox was ticked — rather than "now", so the regulatory record
 * reflects when consent was actually given.
 *
 * Idempotent: safe to call on every authenticated page render.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // best-effort: display name comes from the auth user, not a user field yet
    await supabase.from("profiles").insert({
      id: user.id,
      full_name:
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        null,
    });
  }

  const { data: consent } = await supabase
    .from("consents")
    .select("id")
    .eq("user_id", user.id)
    .eq("doc_type", "terms")
    .maybeSingle();

  if (!consent) {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : null;

    await supabase.from("consents").insert({
      user_id: user.id,
      doc_type: "terms",
      doc_version: TERMS_DOC_VERSION,
      // Account creation time == the moment the consent checkbox was accepted.
      accepted_at: user.created_at,
      ip: ip && ip.length > 0 ? ip : null,
      user_agent: headerList.get("user-agent"),
    });
  }
}
