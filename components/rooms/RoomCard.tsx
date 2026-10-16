import { BedDouble, Ruler, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getAmenity } from "@/lib/data/amenities";
import { formatPHP, pluralize } from "@/lib/utils";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  /** undefined = no date search active; true/false = availability for the searched dates */
  available?: boolean;
  /** Query string (e.g. "checkIn=...&checkOut=...&guests=2") carried into links */
  searchParams?: string;
  priority?: boolean;
}

export function RoomCard({ room, available, searchParams, priority }: RoomCardProps) {
  const suffix = searchParams ? `?${searchParams}` : "";
  const highlightAmenities = room.amenities.slice(0, 3).map(getAmenity);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <Link
        href={`/rooms/${room.slug}${suffix}`}
        className="relative block aspect-[4/3] overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={room.images[0] ?? "/images/property-exterior.jpg"}
          alt={`${room.name} interior`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {available === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-ocean-950/55 backdrop-blur-[2px]">
            <Badge tone="red" className="bg-white/95 px-3 py-1 text-sm">
              Unavailable for your dates
            </Badge>
          </div>
        )}
        {available === true && (
          <Badge tone="green" className="absolute left-3 top-3 bg-white/95 shadow-soft">
            Available for your dates
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-stone-900">
            <Link
              href={`/rooms/${room.slug}${suffix}`}
              className="hover:text-ocean-700 transition-colors"
            >
              {room.name}
            </Link>
          </h3>
          <p className="shrink-0 text-right">
            <span className="text-lg font-semibold text-ocean-800">
              {formatPHP(room.price_per_night)}
            </span>
            <span className="text-xs text-stone-400"> / night</span>
          </p>
        </div>

        <ul className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-stone-500">
          <li className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            {pluralize(room.max_guests, "guest")}
          </li>
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-3.5" aria-hidden />
            {room.bed_summary}
          </li>
          <li className="flex items-center gap-1.5">
            <Ruler className="size-3.5" aria-hidden />
            {room.room_size} m²
          </li>
        </ul>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {highlightAmenities.map((a) => (
            <Badge key={a.key} tone="sand">
              {a.label}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex gap-2.5 pt-5">
          <ButtonLink
            href={`/rooms/${room.slug}${suffix}`}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            View room
          </ButtonLink>
          {available !== false && (
            <ButtonLink
              href={`/booking?room=${room.slug}${searchParams ? `&${searchParams}` : ""}`}
              size="sm"
              className="flex-1"
            >
              Book now
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}
