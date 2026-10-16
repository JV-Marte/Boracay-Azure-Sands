import type { Metadata } from "next";
import { isAfter, isValid, parseISO } from "date-fns";
import { RoomsExplorer } from "@/components/rooms/RoomsExplorer";
import { getAvailableRoomIds } from "@/services/availability";
import { listRooms } from "@/services/rooms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Browse Azure Sands Boracay's island suites — Deluxe Studio, Family Suite, Ocean View Suite, and Premium Loft. Check live availability and prices in PHP.",
};

function validDate(value: string | undefined): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !isValid(parseISO(value))) {
    return null;
  }
  return value;
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const checkIn = validDate(
    typeof params.checkIn === "string" ? params.checkIn : undefined,
  );
  const checkOut = validDate(
    typeof params.checkOut === "string" ? params.checkOut : undefined,
  );
  const guests =
    typeof params.guests === "string" ? Number(params.guests) || undefined : undefined;

  const rooms = await listRooms();

  let availableIds: string[] | null = null;
  if (checkIn && checkOut && isAfter(parseISO(checkOut), parseISO(checkIn))) {
    const ids = await getAvailableRoomIds(
      rooms.map((r) => r.id),
      checkIn,
      checkOut,
    );
    availableIds = [...ids];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-8 md:pb-32">
      <div className="max-w-5xl">
        <h1 className="font-display text-[clamp(2.75rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink-900 text-balance">
          Four ways to stay on the island
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-500">
          Every suite comes with fiber Wi-Fi, air conditioning, housekeeping,
          pool access — and a balcony to argue about who saw the best sunset.
        </p>
      </div>
      <div className="mt-10">
        <RoomsExplorer
          rooms={rooms}
          availableIds={availableIds}
          search={{
            checkIn: checkIn ?? undefined,
            checkOut: checkOut ?? undefined,
            guests,
          }}
        />
      </div>
    </div>
  );
}
