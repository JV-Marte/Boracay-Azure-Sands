"use client";

import { format } from "date-fns";
import { CalendarX2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { InputField, SelectField } from "@/components/ui/Field";
import { AMENITIES } from "@/lib/data/amenities";
import { cn, formatPHP } from "@/lib/utils";
import type { Room } from "@/types";

const ROOM_TYPES = [
  { key: "studio", label: "Studio" },
  { key: "suite", label: "Suite" },
  { key: "loft", label: "Loft" },
];

const BED_TYPES = [
  { key: "queen", label: "Queen bed" },
  { key: "king", label: "King bed" },
  { key: "two_queens", label: "Two queens" },
  { key: "king_and_queen", label: "King + queen" },
];

const FILTER_AMENITIES = [
  "kitchenette",
  "full_kitchen",
  "balcony",
  "ocean_view",
  "bathtub",
  "workspace",
  "family_friendly",
  "sofa_bed",
];

interface RoomsExplorerProps {
  rooms: Room[];
  /** null = no date search active */
  availableIds: string[] | null;
  search: { checkIn?: string; checkOut?: string; guests?: number };
}

export function RoomsExplorer({ rooms, availableIds, search }: RoomsExplorerProps) {
  const router = useRouter();
  const params = useSearchParams();
  const today = format(new Date(), "yyyy-MM-dd");

  // Date search (URL-driven, triggers a server re-render)
  const [checkIn, setCheckIn] = useState(search.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(search.checkOut ?? "");
  const [dateError, setDateError] = useState<string | null>(null);

  // Local filters
  const [guests, setGuests] = useState(search.guests ?? 0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [bedTypes, setBedTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const priceCap = useMemo(
    () => Math.max(...rooms.map((r) => r.price_per_night), 0),
    [rooms],
  );

  const hasDateSearch = availableIds !== null;
  const availableSet = useMemo(
    () => (availableIds === null ? null : new Set(availableIds)),
    [availableIds],
  );

  const searchDates = () => {
    if (!checkIn || !checkOut) {
      setDateError("Pick both dates to check availability.");
      return;
    }
    if (checkOut <= checkIn) {
      setDateError("Check-out must be after check-in (minimum one night).");
      return;
    }
    setDateError(null);
    const next = new URLSearchParams(params.toString());
    next.set("checkIn", checkIn);
    next.set("checkOut", checkOut);
    if (guests > 0) next.set("guests", String(guests));
    router.replace(`/rooms?${next.toString()}`, { scroll: false });
  };

  const clearDates = () => {
    setCheckIn("");
    setCheckOut("");
    setDateError(null);
    router.replace("/rooms", { scroll: false });
  };

  const toggle = (list: string[], set: (v: string[]) => void, key: string) =>
    set(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);

  const filtered = rooms.filter((room) => {
    if (guests > 0 && room.max_guests < guests) return false;
    if (maxPrice > 0 && room.price_per_night > maxPrice) return false;
    if (roomTypes.length && !roomTypes.includes(room.room_type)) return false;
    if (bedTypes.length && !bedTypes.includes(room.bed_type)) return false;
    if (amenities.length && !amenities.every((a) => room.amenities.includes(a)))
      return false;
    if (hasDateSearch && onlyAvailable && availableSet && !availableSet.has(room.id))
      return false;
    return true;
  });

  const resetFilters = () => {
    setGuests(0);
    setMaxPrice(0);
    setRoomTypes([]);
    setBedTypes([]);
    setAmenities([]);
    setOnlyAvailable(true);
  };

  const searchQuery = hasDateSearch
    ? new URLSearchParams({
        checkIn: search.checkIn!,
        checkOut: search.checkOut!,
        ...(search.guests ? { guests: String(search.guests) } : {}),
      }).toString()
    : undefined;

  const checkboxClasses =
    "size-4 rounded border-stone-300 text-ocean-600 accent-ocean-600 focus:ring-ocean-500";

  return (
    <div>
      {/* Date search bar */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-soft sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-end">
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
          <SelectField
            label="Guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            wrapperClassName="lg:w-32"
          >
            <option value={0}>Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </SelectField>
          <Button onClick={searchDates} className="self-end">
            <Search className="size-4" aria-hidden />
            Check availability
          </Button>
          {hasDateSearch && (
            <Button variant="ghost" onClick={clearDates} className="self-end">
              Clear dates
            </Button>
          )}
        </div>
        {dateError && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-600">
            {dateError}
          </p>
        )}
        {hasDateSearch && (
          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className={checkboxClasses}
            />
            Only show rooms available for these dates
          </label>
        )}
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        {/* Filters */}
        <div>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="room-filters"
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 lg:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            {filtersOpen ? "Hide filters" : "Show filters"}
          </button>

          <aside
            id="room-filters"
            aria-label="Room filters"
            className={cn("space-y-6 lg:block", filtersOpen ? "block" : "hidden")}
          >
            <div>
              <h2 className="text-sm font-semibold text-stone-900">
                Max price per night
              </h2>
              <input
                type="range"
                min={0}
                max={priceCap}
                step={500}
                value={maxPrice || priceCap}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value) >= priceCap ? 0 : Number(e.target.value))
                }
                aria-label="Maximum price per night"
                className="mt-3 w-full accent-ocean-600"
              />
              <p className="mt-1 text-sm text-stone-500">
                {maxPrice > 0 ? `Up to ${formatPHP(maxPrice)}` : "Any price"}
              </p>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-stone-900">Room type</legend>
              <div className="mt-2.5 space-y-2">
                {ROOM_TYPES.map((t) => (
                  <label
                    key={t.key}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-600"
                  >
                    <input
                      type="checkbox"
                      checked={roomTypes.includes(t.key)}
                      onChange={() => toggle(roomTypes, setRoomTypes, t.key)}
                      className={checkboxClasses}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-stone-900">Bed type</legend>
              <div className="mt-2.5 space-y-2">
                {BED_TYPES.map((t) => (
                  <label
                    key={t.key}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-600"
                  >
                    <input
                      type="checkbox"
                      checked={bedTypes.includes(t.key)}
                      onChange={() => toggle(bedTypes, setBedTypes, t.key)}
                      className={checkboxClasses}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-stone-900">Amenities</legend>
              <div className="mt-2.5 space-y-2">
                {FILTER_AMENITIES.map((key) => {
                  const def = AMENITIES.find((a) => a.key === key);
                  if (!def) return null;
                  return (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-600"
                    >
                      <input
                        type="checkbox"
                        checked={amenities.includes(key)}
                        onChange={() => toggle(amenities, setAmenities, key)}
                        className={checkboxClasses}
                      />
                      {def.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcw className="size-3.5" aria-hidden />
              Reset filters
            </Button>
          </aside>
        </div>

        {/* Results */}
        <div className="mt-6 lg:mt-0">
          <p className="text-sm text-stone-500" role="status">
            {filtered.length} of {rooms.length} room{rooms.length === 1 ? "" : "s"}
            {hasDateSearch && search.checkIn && search.checkOut && (
              <>
                {" "}
                · {search.checkIn} → {search.checkOut}
              </>
            )}
          </p>
          {filtered.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon={CalendarX2}
              title={
                hasDateSearch
                  ? "No rooms available for those dates"
                  : "No rooms match those filters"
              }
              description={
                hasDateSearch
                  ? "Try shifting your stay by a few days, or loosen the filters — availability changes often."
                  : "Try removing a filter or two. Our four suite types cover most trips."
              }
              action={
                <Button variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  searchParams={searchQuery}
                  available={
                    hasDateSearch && availableSet
                      ? availableSet.has(room.id)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
