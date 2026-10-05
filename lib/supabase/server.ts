import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase server client.
 *
 * `cookies()` is async in Next.js 16, so this factory is async and must be
 * awaited. Reads and writes the session cookie so server components and server
 * actions observe the same session as the browser client.
 *
 * Uses the publishable (anon) key only. Never the service role key — server
 * components run in a context where secrets can leak into the client bundle.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Safe to ignore: called from a Server Component, which cannot
            // mutate cookies. The middleware refreshes the session instead.
          }
        },
      },
    },
  );
}
