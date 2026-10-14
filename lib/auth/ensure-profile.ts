import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { TERMS_DOC_VERSION } from "@/lib/auth/constants";
import type { AuthedUser } from "@/lib/auth/session";

/**
 * Ensures a signed-in user has a `profiles` row and a `terms` consent row.
 *
 * Returns the display name (profile first, then auth metadata) so the caller
 * does not need to re-fetch the profile row.
 *
 * Reads identity from request headers (set by proxy.ts) rather than calling
 * supabase.auth.getUser() again.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: AuthedUser,
): Promise<string | null> {
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

  if (!profileRes.data) {
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: user.fullName,
    });
  }

  if (!consentRes.data) {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : null;

    await supabase.from("consents").insert({
      user_id: user.id,
      doc_type: "terms",
      doc_version: TERMS_DOC_VERSION,
      accepted_at: user.createdAt,
      ip: ip && ip.length > 0 ? ip : null,
      user_agent: headerList.get("user-agent"),
    });
  }

  const profileName = profileRes.data?.full_name?.trim() || null;
  return profileName ?? user.fullName;
}