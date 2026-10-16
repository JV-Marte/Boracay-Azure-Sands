"use client";

import { format } from "date-fns";
import { CalendarX2, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import { InputField, SelectField } from "@/components/ui/Field";
import { computeQuote, nightsBetween } from "@/lib/pricing";
import { formatPHP } from "@/lib/utils";
import type { DateRange, Room } from "@/types";

interface BookingWidgetProps {
  room: Pick<Room, "id" | "slug" | "name" | "price_per_night" | "max_guests">;
  unavailableRanges: DateRange[];
  initial?: { checkIn?: string; checkOut?: string; guests?: number };
}

export function BookingWidget({ room, unavailableRanges, initial }: BookingWidgetProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? "");
  const [guests, setGuests] = useState(
    Math.min(initial?.guests ?? 2, room.max_guests),
  );

  const state = useMemo(() => {
    if (!checkIn || !checkOut) return { kind: "idle" as const };
    if (checkOut <= checkIn) {
      return {
        kind: "invalid" as const,
        message: "Check-out must be after check-in — minimum stay is one night.",
      };
    }
    if (checkIn < today) {
      return { kind: "invalid" as const, message: "Check-in can't be in the past." };
    }
    const nights = nightsBetween(checkIn, checkOut);
    if (nights > 30) {
      return {
        kind: "invalid" as const,
        message: "Online bookings max out at 30 nights — contact us for longer stays.",
      };
    }
    const conflict = unavailableRanges.some(
      (r) => r.start < checkOut && r.end > checkIn,
    );
    if (conflict) return { kind: "unavailable" as const };
    const quote = computeQuote({
      pricePerNight: room.price_per_night,
      checkIn,
      checkOut,
    });
    return { kind: "available" as const, quote };
  }, [checkIn, checkOut, room.price_per_night, today, unavailableRanges]);

  const bookingHref = `/booking?room=${room.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card sm:p-6">
      <p>
        <span className="font-display text-2xl font-semibold text-stone-900">
          {formatPHP(room.price_per_night)}
        </span>
        <span className="text-sm text-stone-400"> / night</span>
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InputField
          label="Check-in"
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <InputField
          label="Check-out"
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      <SelectField
        label="Guests"
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
        wrapperClassName="mt-3"
        hint={`Sleeps up to ${room.max_guests}`}
      >
        {Array.from({ length: room.max_guests }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n} {n === 1 ? "guest" : "guests"}
          </option>
        ))}
      </SelectField>

      {state.kind === "invalid" && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}

      {state.kind === "unavailable" && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-800"
        >
          <CalendarX2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            This room is taken for part of those dates. Check the calendar
            below for open nights, or try another suite.
          </span>
        </div>
      )}

      {state.kind === "available" && (
        <>
          <div
            className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-800"
            role="status"
          >
            <CircleCheck className="size-4 shrink-0" aria-hidden />
            Available for your dates
          </div>
          <PriceBreakdown quote={state.quote} className="mt-4" />
        </>
      )}

      <Link
        href={state.kind === "available" ? bookingHref : "#"}
        aria-disabled={state.kind !== "available"}
        tabIndex={state.kind === "available" ? 0 : -1}
        onClick={(e) => {
          if (state.kind !== "available") e.preventDefault();
        }}
        className={`mt-5 inline-flex h-12 w-full items-center justify-center rounded-full px-7 text-base font-medium transition-colors ${
          state.kind === "available"
            ? "bg-ocean-600 text-white shadow-soft hover:bg-ocean-700"
            : "pointer-events-none bg-stone-200 text-stone-400"
        }`}
      >
        {state.kind === "available" ? "Continue to book" : "Select your dates"}
      </Link>
      <p className="mt-3 text-center text-xs text-stone-400">
        No charge yet — you can review everything before confirming.
      </p>
    </div>
  );
}
