import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase browser client.
 *
 * Uses the publishable (anon) key only. This key is designed to be public and
 * is protected by Row Level Security — see supabase/migrations/0001_initial.sql.
 * Never place the service role key in any file imported by client components.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
