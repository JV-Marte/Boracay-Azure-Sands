import type { Metadata } from "next";
import {
  Ban,
  BedDouble,
  CalendarClock,
  CigaretteOff,
  Clock,
  PawPrint,
  Ruler,
  Users,
  Volume2,
} from "lucide-react";
import { notFound } from "next/navigation";
import { AvailabilityCalendar } from "@/components/rooms/AvailabilityCalendar";
import { BookingWidget } from "@/components/rooms/BookingWidget";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomGallery } from "@/components/rooms/RoomGallery";
import { Badge } from "@/components/ui/Badge";
import { getAmenity } from "@/lib/data/amenities";
import { SITE } from "@/lib/constants";
import { formatPHP } from "@/lib/utils";
import { getUnavailableRanges } from "@/services/availability";
import { getRoomBySlug, listRooms } from "@/services/rooms";

export const dynamic = "force-dynamic";

const ROOM_TYPE_LABEL: Record<string, string> = {
  studio: "Studio",
  suite: "Suite",
  loft: "Loft",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: "Room not found" };
  return {
    title: room.name,
    description: `${room.name} at ${SITE.name} — from ${formatPHP(room.price_per_night)}/night, sleeps ${room.max_guests}. ${room.bed_summary}, ${room.room_size} m². Check availability and book online.`,
    openGraph: {
      title: `${room.name} · ${SITE.shortName}`,
      images: room.images[0] ? [{ url: room.images[0] }] : undefined,
    },
  };
}

const houseRules = [
  { icon: Clock, text: `Check-in ${SITE.checkInTime} · Check-out ${SITE.checkOutTime}` },
  { icon: CigaretteOff, text: "No smoking inside the suites (balcony ashtrays on request)" },
  { icon: PawPrint, text: "No pets, except registered service animals" },
  { icon: Volume2, text: "Quiet hours from 10:00 PM to 7:00 AM" },
  { icon: Ban, text: "No parties or events; visitors until 9:00 PM only" },
  { icon: Users, text: "Registered guests only overnight — capacity is firm" },
];

export default async function RoomDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const room = await getRoomBySlug(slug);
  if (!room || room.status !== "active") notFound();

  const [ranges, allRooms] = await Promise.all([
    getUnavailableRanges(room.id),
    listRooms(),
  ]);
  const related = allRooms.filter((r) => r.id !== room.id).slice(0, 3);

  const initial = {
    checkIn: typeof query.checkIn === "string" ? query.checkIn : undefined,
    checkOut: typeof query.checkOut === "string" ? query.checkOut : undefined,
    guests: typeof query.guests === "string" ? Number(query.guests) || undefined : undefined,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="ocean">{ROOM_TYPE_LABEL[room.room_type] ?? room.room_type}</Badge>
            {room.amenities.includes("ocean_view") && (
              <Badge tone="sunset">Ocean view</Badge>
            )}
          </div>
          <h1 className="mt-2.5 font-display text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            {room.name}
          </h1>
          <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[15px] text-stone-500">
            <li className="flex items-center gap-1.5">
              <Users className="size-4" aria-hidden />
              Sleeps {room.max_guests}
            </li>
            <li className="flex items-center gap-1.5">
              <BedDouble className="size-4" aria-hidden />
              {room.bed_summary}
            </li>
            <li className="flex items-center gap-1.5">
              <Ruler className="size-4" aria-hidden />
              {room.room_size} m²
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0 space-y-12">
          <RoomGallery images={room.images} roomName={room.name} />

          <section aria-labelledby="room-about">
            <h2 id="room-about" className="font-display text-2xl font-semibold text-stone-900">
              About this suite
            </h2>
            <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-stone-600">
              {room.description}
            </p>
          </section>

          <section aria-labelledby="room-amenities">
            <h2 id="room-amenities" className="font-display text-2xl font-semibold text-stone-900">
              Amenities
            </h2>
            <ul className="mt-5 grid gap-x-6 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {room.amenities.map((key) => {
                const amenity = getAmenity(key);
                return (
                  <li key={key} className="flex items-center gap-3 text-[15px] text-stone-700">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sand-50">
                      <amenity.icon className="size-4 text-palm-600" aria-hidden />
                    </span>
                    {amenity.label}
                  </li>
                );
              })}
            </ul>
          </section>

          <AvailabilityCalendar ranges={ranges} />

          <section aria-labelledby="room-rules" className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 id="room-rules" className="font-display text-2xl font-semibold text-stone-900">
                House rules
              </h2>
              <ul className="mt-5 space-y-3.5">
                {houseRules.map((rule) => (
                  <li key={rule.text} className="flex items-start gap-3 text-[15px] text-stone-600">
                    <rule.icon className="mt-0.5 size-4.5 shrink-0 text-ocean-600" aria-hidden />
                    {rule.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-stone-900">
                Cancellation policy
              </h2>
              <ul className="mt-5 space-y-3.5 text-[15px] text-stone-600">
                <li className="flex items-start gap-3">
                  <CalendarClock className="mt-0.5 size-4.5 shrink-0 text-palm-600" aria-hidden />
                  Free cancellation up to 7 days before check-in.
                </li>
                <li className="flex items-start gap-3">
                  <CalendarClock className="mt-0.5 size-4.5 shrink-0 text-sunset-500" aria-hidden />
                  Within 7 days of check-in: the first night is charged.
                </li>
                <li className="flex items-start gap-3">
                  <CalendarClock className="mt-0.5 size-4.5 shrink-0 text-red-500" aria-hidden />
                  Within 48 hours or no-show: 50% of the total applies.
                </li>
              </ul>
              <p className="mt-4 text-sm text-stone-400">
                Cancel any time from the Manage Booking page — refunds are
                released in 5–10 business days.
              </p>
            </div>
          </section>
        </div>

        {/* Booking sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget
            room={room}
            unavailableRanges={ranges}
            initial={initial}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-rooms" className="mt-20">
          <h2 id="related-rooms" className="font-display text-2xl font-semibold text-stone-900">
            Other suites you might like
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
