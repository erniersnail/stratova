import { headers } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { TERMS_DOC_VERSION } from "@/lib/auth/constants";

/**
 * Ensures a signed-in user has a `profiles` row and a `terms` consent row.
 *
 * Returns the user's display name so the caller does not have to re-fetch
 * the same `profiles` row.
 *
 * The profile lookup and the consent lookup run in parallel. On the happy
 * path (both rows exist, which is the common case after first login) this
 * is a single Supabase round trip instead of two.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<string | null> {
  // Fire both checks in parallel — they are independent.
  const [profileRes, consentRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("consents")
      .select("id")
      .eq("user_id", user.id)
      .eq("doc_type", "terms")
      .maybeSingle(),
  ]);

  const authFullName =
    ((user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      "")?.trim() || null;

  // Backfill profile if missing.
  if (!profileRes.data) {
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: authFullName,
    });
  }

  // Backfill consent if missing.
  if (!consentRes.data) {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : null;

    await supabase.from("consents").insert({
      user_id: user.id,
      doc_type: "terms",
      doc_version: TERMS_DOC_VERSION,
      accepted_at: user.created_at,
      ip: ip && ip.length > 0 ? ip : null,
      user_agent: headerList.get("user-agent"),
    });
  }

  const profileName = profileRes.data?.full_name?.trim() || null;
  return profileName ?? authFullName;
}