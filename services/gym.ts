import { randomUUID } from "crypto";
import { generateReference, normalizeReference } from "@/lib/booking-reference";
import { GYM_REFERENCE_PREFIX } from "@/lib/constants";
import { getGymPlan } from "@/lib/data/gym";
import { getMemoryStore } from "@/lib/data/memory-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  isMissingTableError,
  isTableKnownMissing,
  markTableMissing,
} from "@/lib/supabase/module-tables";
import { ServiceError } from "@/services/errors";
import type { GymSignup, GymSignupStatus } from "@/types";
import type { GymSignupRequest } from "@/lib/validation/schemas";

const TABLE = "gym_signups";

function dbReady() {
  return isSupabaseConfigured() && !isTableKnownMissing(TABLE);
}

export async function createGymSignup(request: GymSignupRequest): Promise<GymSignup> {
  const plan = getGymPlan(request.planId);
  if (!plan) throw new ServiceError("That membership is no longer offered.", 400);

  const now = new Date().toISOString();
  const signup: GymSignup = {
    id: randomUUID(),
    reference: generateReference(GYM_REFERENCE_PREFIX),
    plan_id: plan.id,
    full_name: request.fullName,
    email: request.email.toLowerCase(),
    phone: request.phone,
    preferred_start: request.preferredStart,
    goal: request.goal?.trim() ? request.goal.trim() : null,
    is_hotel_guest: request.isHotelGuest,
    status: "new",
    created_at: now,
    updated_at: now,
  };

  if (dbReady()) {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .insert(signup)
      .select()
      .single();
    if (isMissingTableError(error)) {
      markTableMissing(TABLE);
    } else if (error) {
      throw new ServiceError("Could not save your sign-up. Please try again.", 500);
    } else {
      return data as GymSignup;
    }
  }

  getMemoryStore().gymSignups.unshift(signup);
  return signup;
}

export async function findGymSignup(
  reference: string,
  email?: string,
): Promise<GymSignup | null> {
  const ref = normalizeReference(reference);

  if (dbReady()) {
    let query = getSupabase().from(TABLE).select("*").eq("reference", ref);
    if (email) query = query.eq("email", email.toLowerCase());
    const { data, error } = await query.maybeSingle();
    if (isMissingTableError(error)) {
      markTableMissing(TABLE);
    } else if (error) {
      throw new ServiceError("Could not look up that sign-up.", 500);
    } else {
      return (data as GymSignup) ?? null;
    }
  }

  const match = getMemoryStore().gymSignups.find((s) => s.reference === ref);
  if (!match) return null;
  if (email && match.email !== email.toLowerCase()) return null;
  return match;
}

export interface GymSignupFilters {
  status?: GymSignupStatus;
}

export async function listGymSignups(filters?: GymSignupFilters): Promise<GymSignup[]> {
  if (dbReady()) {
    let query = getSupabase()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (filters?.status) query = query.eq("status", filters.status);
    const { data, error } = await query;
    if (isMissingTableError(error)) {
      markTableMissing(TABLE);
    } else if (error) {
      throw new ServiceError("Could not load membership sign-ups.", 500);
    } else {
      return data as GymSignup[];
    }
  }

  const all = getMemoryStore().gymSignups;
  const filtered = filters?.status ? all.filter((s) => s.status === filters.status) : all;
  return [...filtered].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateGymSignupStatus(
  id: string,
  status: GymSignupStatus,
): Promise<void> {
  if (dbReady()) {
    const { error } = await getSupabase()
      .from(TABLE)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (isMissingTableError(error)) {
      markTableMissing(TABLE);
    } else if (error) {
      throw new ServiceError("Could not update that sign-up.", 500);
    } else {
      return;
    }
  }

  const signup = getMemoryStore().gymSignups.find((s) => s.id === id);
  if (!signup) throw new ServiceError("Sign-up not found.", 404);
  signup.status = status;
  signup.updated_at = new Date().toISOString();
}
