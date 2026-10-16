/**
 * The gym and cafe modules live in tables created by supabase/modules.sql,
 * which is a separate migration from the condotel's schema.sql. If someone
 * runs the app against a Supabase project where that file has not been applied
 * yet, we fall back to the in-memory demo store for those tables instead of
 * throwing — the marketing pages and the demo flow keep working, and the
 * console says exactly what to run.
 */
const knownMissing = new Set<string>();

interface PostgrestLikeError {
  code?: string;
  message?: string;
}

export function isMissingTableError(error: PostgrestLikeError | null | undefined) {
  if (!error) return false;
  // 42P01 is Postgres "undefined_table"; PGRST205 is PostgREST's schema-cache miss.
  if (error.code === "42P01" || error.code === "PGRST205") return true;
  return /(relation|table).*(does not exist)|could not find the table/i.test(
    error.message ?? "",
  );
}

/** Record a missing table once so later requests skip Supabase entirely. */
export function markTableMissing(table: string) {
  if (knownMissing.has(table)) return;
  knownMissing.add(table);
  console.warn(
    `[modules] Table "${table}" is missing from Supabase — serving demo data instead. ` +
      `Run supabase/modules.sql in the Supabase SQL editor to enable it.`,
  );
}

export function isTableKnownMissing(table: string) {
  return knownMissing.has(table);
}
