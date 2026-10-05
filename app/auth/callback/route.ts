import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase auth callback — exchanges the `code` appended to email links
 * (password reset, email confirmation) for a session cookie BEFORE the
 * destination page is reachable.
 *
 * Supabase → URL Configuration → Redirect URLs must allow-list:
 *   http://localhost:3000/auth/callback
 * (plus the production equivalent). The `next` param selects the page
 * after a successful exchange; it defaults to /reset-password.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/reset-password";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Exchange failed or no code — redirect to login with an error flag.
  return NextResponse.redirect(`${origin}/login?error=reset_link_invalid`);
}
