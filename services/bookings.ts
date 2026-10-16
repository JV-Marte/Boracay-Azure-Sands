import { randomUUID } from "crypto";
import { generateBookingReference, normalizeReference } from "@/lib/booking-reference";
import { PRICING } from "@/lib/constants";
import { getMemoryStore } from "@/lib/data/memory-store";
import { computeQuote, nightsBetween } from "@/lib/pricing";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";
import type { BookingRequest } from "@/lib/validation/schemas";
import { isRoomAvailable } from "@/services/availability";
import { ServiceError } from "@/services/errors";
import { getValidPromo, incrementPromoUsage } from "@/services/promos";
import { getRoomById } from "@/services/rooms";
import type { Booking, PaymentStatus, PromoCode, Room } from "@/types";

export interface BookingWithRoom {
  booking: Booking;
  room: Room | null;
}

/**
 * Create a booking with full server-side validation and double-booking
 * prevention. In Supabase mode, a Postgres exclusion constraint provides a
 * race-safe backstop on top of the availability check.
 */
export async function createBooking(request: BookingRequest): Promise<Booking> {
  const room = await getRoomById(request.roomId);
  if (!room || room.status !== "active") {
    throw new ServiceError("That room is not available for booking.", 404);
  }

  const nights = nightsBetween(request.checkIn, request.checkOut);
  if (nights < 1) {
    throw new ServiceError("Check-out must be after check-in — the minimum stay is one night.");
  }
  if (nights > PRICING.maxNights) {
    throw new ServiceError(
      `Online bookings are limited to ${PRICING.maxNights} nights. Contact us for longer stays.`,
    );
  }
  if (request.checkIn < todayISO()) {
    throw new ServiceError("Check-in can't be in the past.");
  }
  if (request.guestCount > room.max_guests) {
    throw new ServiceError(
      `${room.name} sleeps up to ${room.max_guests} guests. Please pick a larger room or reduce the guest count.`,
    );
  }

  let promo: PromoCode | null = null;
  if (request.promoCode) {
    promo = await getValidPromo(request.promoCode);
  }

  const available = await isRoomAvailable(room.id, request.checkIn, request.checkOut);
  if (!available) {
    throw new ServiceError(
      "Those dates were just taken for this room. Please choose different dates.",
      409,
    );
  }

  const quote = computeQuote({
    pricePerNight: room.price_per_night,
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    promo,
  });

  const now = new Date().toISOString();
  const paymentStatus: PaymentStatus = "pending";
  const booking: Booking = {
    id: randomUUID(),
    booking_reference: generateBookingReference(),
    room_id: room.id,
    guest_name: request.guestName,
    guest_email: request.guestEmail.toLowerCase(),
    guest_phone: request.guestPhone,
    country: request.country,
    check_in: request.checkIn,
    check_out: request.checkOut,
    guest_count: request.guestCount,
    special_requests: request.specialRequests || null,
    subtotal: quote.subtotal,
    fees: quote.fees,
    taxes: quote.taxes,
    discount: quote.discount,
    total: quote.total,
    promo_code: promo?.code ?? null,
    payment_method: request.paymentMethod,
    payment_status: paymentStatus,
    booking_status: "pending",
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    // Retry once on the (astronomically unlikely) reference collision.
    for (let attempt = 0; attempt < 2; attempt++) {
      const { error } = await getSupabase().from("bookings").insert(booking);
      if (!error) break;
      if (error.code === "23505" && attempt === 0) {
        booking.booking_reference = generateBookingReference();
        continue;
      }
      if (error.code === "23P01") {
        // Exclusion constraint: another booking won the race for these dates.
        throw new ServiceError(
          "Those dates were just taken for this room. Please choose different dates.",
          409,
        );
      }
      console.error("Booking insert failed:", error);
      throw new ServiceError("We couldn't save your booking. Please try again.", 500);
    }
  } else {
    getMemoryStore().bookings.push(booking);
  }

  if (promo) await incrementPromoUsage(promo.code);
  return booking;
}

/** Look up a booking by reference + guest email (case-insensitive). */
export async function findBooking(
  reference: string,
  email: string,
): Promise<BookingWithRoom> {
  const ref = normalizeReference(reference);
  const mail = email.trim().toLowerCase();
  let booking: Booking | null = null;

  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("bookings")
      .select("*")
      .eq("booking_reference", ref)
      .maybeSingle();
    if (error) throw new ServiceError("Could not look up that booking.", 500);
    booking = data as Booking | null;
  } else {
    booking =
      getMemoryStore().bookings.find((b) => b.booking_reference === ref) ?? null;
  }

  if (!booking || booking.guest_email.toLowerCase() !== mail) {
    throw new ServiceError(
      "We couldn't find a booking with that reference and email. Double-check both and try again.",
      404,
    );
  }
  const room = await getRoomById(booking.room_id);
  return { booking, room };
}

export async function cancelBooking(reference: string, email: string): Promise<Booking> {
  const { booking } = await findBooking(reference, email);
  if (booking.booking_status === "cancelled") {
    throw new ServiceError("This booking is already cancelled.");
  }
  if (booking.booking_status === "completed") {
    throw new ServiceError("Completed stays can't be cancelled.");
  }
  if (booking.check_in <= todayISO()) {
    throw new ServiceError(
      "Online cancellation closes on the check-in day. Please contact the front desk.",
    );
  }
  const patch = {
    booking_status: "cancelled" as const,
    // Paid bookings are flagged for refund processing by the team.
    payment_status: (booking.payment_status === "paid"
      ? "refunded"
      : booking.payment_status) as PaymentStatus,
    updated_at: new Date().toISOString(),
  };
  return applyBookingPatch(booking.id, patch);
}

export async function updateGuestInfo(
  reference: string,
  email: string,
  patch: { guestName: string; guestPhone: string; specialRequests?: string },
): Promise<Booking> {
  const { booking } = await findBooking(reference, email);
  if (booking.booking_status === "cancelled") {
    throw new ServiceError("Cancelled bookings can't be edited.");
  }
  return applyBookingPatch(booking.id, {
    guest_name: patch.guestName,
    guest_phone: patch.guestPhone,
    special_requests: patch.specialRequests || null,
    updated_at: new Date().toISOString(),
  });
}

async function applyBookingPatch(
  id: string,
  patch: Partial<Booking>,
): Promise<Booking> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("bookings")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error || !data) throw new ServiceError("Could not update the booking.", 500);
    return data as Booking;
  }
  const booking = getMemoryStore().bookings.find((b) => b.id === id);
  if (!booking) throw new ServiceError("Booking not found.", 404);
  Object.assign(booking, patch);
  return booking;
}

// ---- Admin -----------------------------------------------------------------

export interface BookingFilters {
  status?: string;
  search?: string;
}

export async function listBookings(filters?: BookingFilters): Promise<Booking[]> {
  let bookings: Booking[];
  if (isSupabaseConfigured()) {
    let query = getSupabase()
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (filters?.status) query = query.eq("booking_status", filters.status);
    const { data, error } = await query;
    if (error) throw new ServiceError("Could not load bookings.", 500);
    bookings = data as Booking[];
  } else {
    bookings = [...getMemoryStore().bookings].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
    if (filters?.status) {
      bookings = bookings.filter((b) => b.booking_status === filters.status);
    }
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    bookings = bookings.filter(
      (b) =>
        b.booking_reference.toLowerCase().includes(q) ||
        b.guest_name.toLowerCase().includes(q) ||
        b.guest_email.toLowerCase().includes(q),
    );
  }
  return bookings;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new ServiceError("Could not load the booking.", 500);
    return (data as Booking) ?? null;
  }
  return getMemoryStore().bookings.find((b) => b.id === id) ?? null;
}

export async function adminUpdateBooking(
  id: string,
  patch: { booking_status?: Booking["booking_status"]; payment_status?: PaymentStatus },
): Promise<Booking> {
  const booking = await getBookingById(id);
  if (!booking) throw new ServiceError("Booking not found.", 404);

  // Re-confirming a cancelled booking must not create a double booking.
  if (
    patch.booking_status &&
    ["pending", "confirmed"].includes(patch.booking_status) &&
    !["pending", "confirmed"].includes(booking.booking_status)
  ) {
    const available = await isRoomAvailable(
      booking.room_id,
      booking.check_in,
      booking.check_out,
    );
    if (!available) {
      throw new ServiceError(
        "Those dates are now taken by another booking — this one can't be reinstated.",
        409,
      );
    }
  }

  return applyBookingPatch(id, { ...patch, updated_at: new Date().toISOString() });
}
