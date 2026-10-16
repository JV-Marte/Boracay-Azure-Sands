import { randomUUID } from "crypto";
import { getMemoryStore } from "@/lib/data/memory-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";
import { ServiceError } from "@/services/errors";
import type { PromoCode } from "@/types";

async function findPromo(code: string): Promise<PromoCode | null> {
  const normalized = code.trim().toUpperCase();
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("promo_codes")
      .select("*")
      .ilike("code", normalized)
      .maybeSingle();
    if (error) throw new ServiceError("Could not check that promo code.", 500);
    return (data as PromoCode) ?? null;
  }
  return (
    getMemoryStore().promoCodes.find(
      (p) => p.code.toUpperCase() === normalized,
    ) ?? null
  );
}

/** Validate a promo code; throws a ServiceError with a friendly reason. */
export async function getValidPromo(code: string): Promise<PromoCode> {
  const promo = await findPromo(code);
  if (!promo) throw new ServiceError("We don't recognize that promo code.", 404);
  if (!promo.active) throw new ServiceError("That promo code is no longer active.");
  const today = todayISO();
  if (today < promo.valid_from) {
    throw new ServiceError("That promo code isn't active yet.");
  }
  if (today > promo.valid_until) {
    throw new ServiceError("That promo code has expired.");
  }
  if (promo.usage_limit !== null && promo.used_count >= promo.usage_limit) {
    throw new ServiceError("That promo code has reached its usage limit.");
  }
  return promo;
}

export async function incrementPromoUsage(code: string): Promise<void> {
  if (isSupabaseConfigured()) {
    // Atomic increment via RPC defined in supabase/schema.sql
    const { error } = await getSupabase().rpc("increment_promo_usage", {
      promo_code: code.trim().toUpperCase(),
    });
    if (error) console.error("Failed to increment promo usage:", error.message);
    return;
  }
  const promo = getMemoryStore().promoCodes.find(
    (p) => p.code.toUpperCase() === code.trim().toUpperCase(),
  );
  if (promo) promo.used_count += 1;
}

// ---- Admin -----------------------------------------------------------------

export async function listPromoCodes(): Promise<PromoCode[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new ServiceError("Could not load promo codes.", 500);
    return data as PromoCode[];
  }
  return [...getMemoryStore().promoCodes].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}

export type PromoInput = Omit<PromoCode, "id" | "used_count" | "created_at">;

export async function createPromoCode(input: PromoInput): Promise<PromoCode> {
  const existing = await findPromo(input.code);
  if (existing) throw new ServiceError("A promo code with that name already exists.", 409);
  const promo: PromoCode = {
    ...input,
    code: input.code.toUpperCase(),
    id: randomUUID(),
    used_count: 0,
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("promo_codes")
      .insert(promo)
      .select()
      .single();
    if (error) throw new ServiceError("Could not create the promo code.", 500);
    return data as PromoCode;
  }
  getMemoryStore().promoCodes.push(promo);
  return promo;
}

export async function setPromoActive(id: string, active: boolean): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase()
      .from("promo_codes")
      .update({ active })
      .eq("id", id);
    if (error) throw new ServiceError("Could not update the promo code.", 500);
    return;
  }
  const promo = getMemoryStore().promoCodes.find((p) => p.id === id);
  if (!promo) throw new ServiceError("Promo code not found.", 404);
  promo.active = active;
}

export async function deletePromoCode(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from("promo_codes").delete().eq("id", id);
    if (error) throw new ServiceError("Could not delete the promo code.", 500);
    return;
  }
  const store = getMemoryStore();
  const index = store.promoCodes.findIndex((p) => p.id === id);
  if (index === -1) throw new ServiceError("Promo code not found.", 404);
  store.promoCodes.splice(index, 1);
}
