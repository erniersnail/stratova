import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase session refresh + route gating.
 *
 * Refreshes the auth cookie on every matched request, then enforces:
 *   - protected routes (/account, /dashboard) require a session
 *   - auth routes (/login, /signup) are redirected away once signed in
 *
 * All marketing routes stay public.
 *
 * Uses getUser(), not getSession(): getSession reads the cookie without
 * validating it against Supabase, so it is not safe for authorisation.
 *
 * Uses the publishable (anon) key only. Never the service role key.
 */

/** Routes that require an authenticated session. Prefix-matched. */
const PROTECTED_ROUTES = ["/account", "/dashboard"];

/** Routes a signed-in user should be redirected away from. */
const AUTH_ROUTES = ["/login", "/signup"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Validates the token with Supabase AND refreshes the session.
  // Do not remove: without it the session is never renewed and the user is
  // silently signed out later.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    url.search = "";
    return NextResponse.redirect(url);
  }

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
