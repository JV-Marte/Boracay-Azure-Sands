import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { listRooms } from "@/services/rooms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book your stay",
  description:
    "Book your Boracay stay at Azure Sands in four quick steps — pick a suite, add your details, review the price, choose how to pay.",
  robots: { index: false },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rooms = await listRooms();

  const roomSlug = typeof params.room === "string" ? params.room : undefined;
  const initial = {
    roomId: rooms.find((r) => r.slug === roomSlug)?.id,
    checkIn: typeof params.checkIn === "string" ? params.checkIn : undefined,
    checkOut: typeof params.checkOut === "string" ? params.checkOut : undefined,
    guests:
      typeof params.guests === "string" ? Number(params.guests) || undefined : undefined,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-8 md:pb-32">
      <h1 className="font-display text-[clamp(2.75rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink-900 text-balance">
        Four steps to the island
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-500">
        No account needed. You’ll get a booking reference and email
        confirmation as soon as you’re done.
      </p>
      <div className="mt-10">
        <BookingWizard rooms={rooms} initial={initial} />
      </div>
    </div>
  );
}
