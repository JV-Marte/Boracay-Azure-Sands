import { getMemoryStore } from "@/lib/data/memory-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { ServiceError } from "@/services/errors";
import type { DateRange } from "@/types";

/**
 * Availability model: a booking or block occupies the half-open range
 * [check_in, check_out) — check-out day is free for the next guest.
 * Pending and confirmed bookings block dates; cancelled/completed release them.
 */
const BLOCKING_STATUSES = ["pending", "confirmed"] as const;

function overlaps(range: DateRange, checkIn: string, checkOut: string) {
  return range.start < checkOut && range.end > checkIn;
}

/** All unavailable ranges for a room (active bookings + manual blocks). */
export async function getUnavailableRanges(roomId: string): Promise<DateRange[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const [bookingsRes, blocksRes] = await Promise.all([
      supabase
        .from("bookings")
        .select("check_in, check_out")
        .eq("room_id", roomId)
        .in("booking_status", [...BLOCKING_STATUSES]),
      supabase
        .from("blocked_dates")
        .select("start_date, end_date")
        .eq("room_id", roomId),
    ]);
    if (bookingsRes.error || blocksRes.error) {
      throw new ServiceError("Could not check availability.", 500);
    }
    return [
      ...bookingsRes.data.map((b) => ({ start: b.check_in, end: b.check_out })),
      ...blocksRes.data.map((b) => ({ start: b.start_date, end: b.end_date })),
    ];
  }

  const store = getMemoryStore();
  return [
    ...store.bookings
      .filter(
        (b) =>
          b.room_id === roomId &&
          (BLOCKING_STATUSES as readonly string[]).includes(b.booking_status),
      )
      .map((b) => ({ start: b.check_in, end: b.check_out })),
    ...store.blockedDates
      .filter((b) => b.room_id === roomId)
      .map((b) => ({ start: b.start_date, end: b.end_date })),
  ];
}

export async function isRoomAvailable(
  roomId: string,
  checkIn: string,
  checkOut: string,
): Promise<boolean> {
  const ranges = await getUnavailableRanges(roomId);
  return !ranges.some((r) => overlaps(r, checkIn, checkOut));
}

/** Room ids that are free for the whole [checkIn, checkOut) range. */
export async function getAvailableRoomIds(
  roomIds: string[],
  checkIn: string,
  checkOut: string,
): Promise<Set<string>> {
  const results = await Promise.all(
    roomIds.map(async (id) => ({
      id,
      available: await isRoomAvailable(id, checkIn, checkOut),
    })),
  );
  return new Set(results.filter((r) => r.available).map((r) => r.id));
}
