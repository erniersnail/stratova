import { headers } from "next/headers";

export type AuthedUser = {
  id: string;
  email: string;
  createdAt: string;
  fullName: string | null;
};

/**
 * Reads the authenticated user from request headers set by proxy.ts.
 *
 * proxy.ts runs `supabase.auth.getUser()` once per request on protected
 * routes and injects the resulting identity into request headers. Server
 * components read them here, avoiding a second round trip to Supabase Auth
 * (~400–800ms from India).
 *
 * Headers cannot be forged: proxy.ts overwrites any x-user-* value on the
 * incoming request before the page sees it. If the headers are absent the
 * caller should redirect to /login.
 */
export async function getAuthedUser(): Promise<AuthedUser | null> {
  const h = await headers();
  const id = h.get("x-user-id");
  if (!id) return null;
  return {
    id,
    email: h.get("x-user-email") ?? "",
    createdAt: h.get("x-user-created-at") ?? new Date().toISOString(),
    fullName: h.get("x-user-name"),
  };
}