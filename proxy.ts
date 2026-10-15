import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase session refresh + route gating.
 *
 * Runs only on routes that require auth awareness. Public marketing pages
 * skip this middleware entirely, saving a Supabase Auth round trip per load.
 *
 * After validating the session, injects user identity into request headers
 * (x-user-id, x-user-email, x-user-created-at, x-user-name) so downstream
 * server components can read them without calling auth.getUser() again.
 */

const PROTECTED_ROUTES = ["/account", "/dashboard"];
const ADMIN_ROUTES = ["/admin"];
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
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAdminRoute = ADMIN_ROUTES.some(
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

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/__not-found";
      return NextResponse.rewrite(url);
    }
  }

  // Inject user identity into request headers for downstream server components.
  if (user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    if (user.email) requestHeaders.set("x-user-email", user.email);
    if (user.created_at) requestHeaders.set("x-user-created-at", user.created_at);
    const metaName =
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined);
    if (metaName && metaName.length > 0) {
      requestHeaders.set("x-user-name", metaName);
    } else {
      requestHeaders.delete("x-user-name");
    }

    const rebuilt = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Re-apply session cookies Supabase set during getUser().
    for (const cookie of supabaseResponse.cookies.getAll()) {
      rebuilt.cookies.set(cookie);
    }

    return rebuilt;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/account/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/signup/:path*",
    "/auth/callback",
  ],
};
