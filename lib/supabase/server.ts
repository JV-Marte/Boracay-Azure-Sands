import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * All database access in this app happens on the server (server components
 * and route handlers), so we use a single server-side Supabase client.
 *
 * When the env vars below are absent, the app transparently falls back to an
 * in-memory demo store (see lib/data/memory-store.ts) so `npm run dev` works
 * with zero setup.
 */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  if (!cached) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Prefer the service role key: booking writes and admin operations run
    // behind our own server-side checks. Never expose this key to the client.
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
