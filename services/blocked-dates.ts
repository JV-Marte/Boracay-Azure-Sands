import { randomUUID } from "crypto";
import { getMemoryStore } from "@/lib/data/memory-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { ServiceError } from "@/services/errors";
import type { BlockedDate } from "@/types";

export async function listBlockedDates(): Promise<BlockedDate[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("blocked_dates")
      .select("*")
      .order("start_date", { ascending: true });
    if (error) throw new ServiceError("Could not load blocked dates.", 500);
    return data as BlockedDate[];
  }
  return [...getMemoryStore().blockedDates].sort((a, b) =>
    a.start_date.localeCompare(b.start_date),
  );
}

export async function createBlockedDate(input: {
  roomId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}): Promise<BlockedDate> {
  const block: BlockedDate = {
    id: randomUUID(),
    room_id: input.roomId,
    start_date: input.startDate,
    end_date: input.endDate,
    reason: input.reason || null,
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("blocked_dates")
      .insert(block)
      .select()
      .single();
    if (error) throw new ServiceError("Could not block those dates.", 500);
    return data as BlockedDate;
  }
  getMemoryStore().blockedDates.push(block);
  return block;
}

export async function deleteBlockedDate(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from("blocked_dates").delete().eq("id", id);
    if (error) throw new ServiceError("Could not remove the block.", 500);
    return;
  }
  const store = getMemoryStore();
  const index = store.blockedDates.findIndex((b) => b.id === id);
  if (index === -1) throw new ServiceError("Block not found.", 404);
  store.blockedDates.splice(index, 1);
}
