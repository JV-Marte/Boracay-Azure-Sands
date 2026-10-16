import { BlockedDatesManager } from "@/components/admin/BlockedDatesManager";
import { listBlockedDates } from "@/services/blocked-dates";
import { listRooms } from "@/services/rooms";

export const dynamic = "force-dynamic";

export default async function BlockedDatesPage() {
  const [blocks, rooms] = await Promise.all([
    listBlockedDates(),
    listRooms({ includeInactive: true }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold text-stone-900">Blocked dates</h1>
      <p className="mt-1 text-sm text-stone-500">
        Take rooms off the market for maintenance or owner use. Blocks work like
        bookings: the end date is when the room becomes available again.
      </p>
      <div className="mt-8">
        <BlockedDatesManager blocks={blocks} rooms={rooms} />
      </div>
    </div>
  );
}
