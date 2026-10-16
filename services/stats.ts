import { addDays, format, parseISO, startOfMonth } from "date-fns";
import { todayISO } from "@/lib/utils";
import { listBookings } from "@/services/bookings";
import { listBlockedDates } from "@/services/blocked-dates";
import { listRooms } from "@/services/rooms";
import type { AdminStats, Booking } from "@/types";

const REVENUE_STATUSES = ["pending", "confirmed", "completed"];

/**
 * Dashboard aggregates, computed in app code so they work identically against
 * Supabase and the in-memory demo store (booking volumes are small).
 */
export async function getAdminStats(): Promise<AdminStats> {
  const [bookings, rooms, blocks] = await Promise.all([
    listBookings(),
    listRooms({ includeInactive: true }),
    listBlockedDates(),
  ]);

  const today = todayISO();
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const active = bookings.filter((b) => REVENUE_STATUSES.includes(b.booking_status));

  const upcomingCheckIns = active
    .filter((b) => b.check_in >= today && b.booking_status !== "completed")
    .sort((a, b) => a.check_in.localeCompare(b.check_in))
    .slice(0, 5);

  const upcomingCheckOuts = active
    .filter((b) => b.check_out >= today && b.check_in <= today)
    .sort((a, b) => a.check_out.localeCompare(b.check_out))
    .slice(0, 5);

  const revenueTotal = active.reduce((sum, b) => sum + b.total, 0);
  const revenueThisMonth = active
    .filter((b) => b.created_at.slice(0, 10) >= monthStart)
    .reduce((sum, b) => sum + b.total, 0);

  // Occupancy: booked or blocked room-nights over the next 30 days.
  const horizon = 30;
  const activeRooms = rooms.filter((r) => r.status === "active");
  let occupied = 0;
  const blocking = bookings.filter((b) =>
    ["pending", "confirmed"].includes(b.booking_status),
  );
  for (let i = 0; i < horizon; i++) {
    const day = format(addDays(parseISO(today), i), "yyyy-MM-dd");
    for (const room of activeRooms) {
      const taken =
        blocking.some(
          (b) => b.room_id === room.id && b.check_in <= day && b.check_out > day,
        ) ||
        blocks.some(
          (b) => b.room_id === room.id && b.start_date <= day && b.end_date > day,
        );
      if (taken) occupied++;
    }
  }
  const totalRoomNights = activeRooms.length * horizon;
  const occupancyRate = totalRoomNights
    ? Math.round((occupied / totalRoomNights) * 100)
    : 0;

  const recentBookings: Booking[] = bookings.slice(0, 8);

  return {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.booking_status === "pending").length,
    upcomingCheckIns,
    upcomingCheckOuts,
    revenueThisMonth,
    revenueTotal,
    occupancyRate,
    recentBookings,
  };
}
