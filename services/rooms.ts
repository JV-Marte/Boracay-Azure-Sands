import { randomUUID } from "crypto";
import { getMemoryStore } from "@/lib/data/memory-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { ServiceError } from "@/services/errors";
import type { Room } from "@/types";

export type RoomInput = Omit<Room, "id" | "slug" | "created_at" | "updated_at">;

export async function listRooms(options?: { includeInactive?: boolean }): Promise<Room[]> {
  if (isSupabaseConfigured()) {
    let query = getSupabase()
      .from("rooms")
      .select("*")
      .order("price_per_night", { ascending: true });
    if (!options?.includeInactive) query = query.eq("status", "active");
    const { data, error } = await query;
    if (error) throw new ServiceError("Could not load rooms. Please try again.", 500);
    return data as Room[];
  }
  const rooms = getMemoryStore().rooms;
  const filtered = options?.includeInactive
    ? rooms
    : rooms.filter((r) => r.status === "active");
  return [...filtered].sort((a, b) => a.price_per_night - b.price_per_night);
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("rooms")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new ServiceError("Could not load this room.", 500);
    return (data as Room) ?? null;
  }
  return getMemoryStore().rooms.find((r) => r.slug === slug) ?? null;
}

export async function getRoomById(id: string): Promise<Room | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("rooms")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new ServiceError("Could not load this room.", 500);
    return (data as Room) ?? null;
  }
  return getMemoryStore().rooms.find((r) => r.id === id) ?? null;
}

async function uniqueSlug(name: string, ignoreId?: string): Promise<string> {
  const base = slugify(name) || "room";
  const rooms = await listRooms({ includeInactive: true });
  let slug = base;
  let n = 2;
  while (rooms.some((r) => r.slug === slug && r.id !== ignoreId)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function createRoom(input: RoomInput): Promise<Room> {
  const slug = await uniqueSlug(input.name);
  const now = new Date().toISOString();
  const room: Room = {
    ...input,
    id: randomUUID(),
    slug,
    created_at: now,
    updated_at: now,
  };
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("rooms")
      .insert(room)
      .select()
      .single();
    if (error) throw new ServiceError("Could not create the room.", 500);
    return data as Room;
  }
  getMemoryStore().rooms.push(room);
  return room;
}

export async function updateRoom(id: string, input: Partial<RoomInput>): Promise<Room> {
  const patch: Partial<Room> = { ...input, updated_at: new Date().toISOString() };
  if (input.name) patch.slug = await uniqueSlug(input.name, id);

  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("rooms")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new ServiceError("Could not update the room.", 500);
    if (!data) throw new ServiceError("Room not found.", 404);
    return data as Room;
  }
  const store = getMemoryStore();
  const room = store.rooms.find((r) => r.id === id);
  if (!room) throw new ServiceError("Room not found.", 404);
  Object.assign(room, patch);
  return room;
}

export async function deleteRoom(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("room_id", id);
    if (count && count > 0) {
      throw new ServiceError(
        "This room has bookings on record. Set it to inactive instead of deleting it.",
        409,
      );
    }
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) throw new ServiceError("Could not delete the room.", 500);
    return;
  }
  const store = getMemoryStore();
  if (store.bookings.some((b) => b.room_id === id)) {
    throw new ServiceError(
      "This room has bookings on record. Set it to inactive instead of deleting it.",
      409,
    );
  }
  const index = store.rooms.findIndex((r) => r.id === id);
  if (index === -1) throw new ServiceError("Room not found.", 404);
  store.rooms.splice(index, 1);
}
