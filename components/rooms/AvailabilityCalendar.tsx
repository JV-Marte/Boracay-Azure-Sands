"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/types";

interface AvailabilityCalendarProps {
  /** Unavailable half-open ranges [start, end) in yyyy-MM-dd */
  ranges: DateRange[];
}

function isUnavailable(day: string, ranges: DateRange[]) {
  return ranges.some((r) => r.start <= day && day < r.end);
}

function MonthGrid({ month, ranges }: { month: Date; ranges: DateRange[] }) {
  const today = startOfDay(new Date());
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leadingBlanks = getDay(startOfMonth(month)); // 0 = Sunday

  return (
    <div>
      <p className="text-center text-sm font-semibold text-stone-900">
        {format(month, "MMMM yyyy")}
      </p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="pb-1 text-[11px] font-medium uppercase text-stone-400">
            {d}
          </span>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <span key={`blank-${i}`} aria-hidden />
        ))}
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const past = isBefore(day, today);
          const taken = !past && isUnavailable(iso, ranges);
          return (
            <span
              key={iso}
              aria-label={`${format(day, "MMMM d, yyyy")}: ${
                past ? "past date" : taken ? "unavailable" : "available"
              }`}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-[13px]",
                past && "text-stone-300",
                taken && "bg-stone-100 text-stone-400 line-through",
                !past && !taken && "bg-palm-50 font-medium text-palm-800",
              )}
            >
              {format(day, "d")}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function AvailabilityCalendar({ ranges }: AvailabilityCalendarProps) {
  const [offset, setOffset] = useState(0);
  const base = addMonths(startOfMonth(new Date()), offset);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-medium text-ink-900">
          Availability
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(o - 1, 0))}
            disabled={offset === 0}
            aria-label="Previous month"
            className="rounded-full p-1.5 text-stone-500 transition-colors hover:bg-stone-100 disabled:opacity-30"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(o + 1, 11))}
            disabled={offset >= 11}
            aria-label="Next month"
            className="rounded-full p-1.5 text-stone-500 transition-colors hover:bg-stone-100 disabled:opacity-30"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-8 sm:grid-cols-2">
        <MonthGrid month={base} ranges={ranges} />
        <div className="hidden sm:block">
          <MonthGrid month={addMonths(base, 1)} ranges={ranges} />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-100 pt-4 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-palm-50 ring-1 ring-palm-200" aria-hidden />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-stone-100 ring-1 ring-stone-200" aria-hidden />
          Booked or blocked
        </span>
        <span className="text-stone-400">Check-out days free up for new arrivals.</span>
      </div>
    </div>
  );
}
