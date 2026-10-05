import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase session refresh middleware.
 *
 * Keeps the auth cookie fresh on every matched request. Intentionally performs
 * NO route protection — gating /dashboard and /account arrives in Phase 3.
 *
 * Uses the publishable (anon) key only. Never the service role key.
 */
export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // Rebuild the response so refreshed cookies reach the browser.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Must run getUser() to trigger the token refresh. Do not remove: without it
  // the session is never renewed and the user is silently signed out later.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match every route except:
     * - _next/static   (build output)
     * - _next/image    (image optimizer)
     * - favicon.ico    and common static asset extensions
     * - sitemap.xml / robots.txt (generated routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$|sitemap\\.xml|robots\\.txt).*)",
  ],
};
