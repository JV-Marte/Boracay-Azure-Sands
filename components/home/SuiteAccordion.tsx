"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn, formatPHP, pluralize } from "@/lib/utils";
import type { Room } from "@/types";

/**
 * Suites as vertical slices that widen on hover or focus (desktop) and
 * stack as tappable bands (phone). The open slice reveals details and a link.
 */
export function SuiteAccordion({ rooms }: { rooms: Room[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-[52rem] flex-col gap-2.5 md:h-[36rem] md:flex-row lg:h-[40rem]">
      {rooms.map((room, i) => {
        const open = active === i;
        const panelId = `suite-panel-${room.slug}`;
        return (
          <div
            key={room.id}
            onMouseEnter={() => setActive(i)}
            onFocusCapture={() => setActive(i)}
            className={cn(
              "group relative min-h-0 min-w-0 overflow-hidden rounded-[1.75rem] bg-ink-800 transition-[flex-grow] duration-700 ease-[var(--ease-out-expo)]",
              open ? "grow-[5]" : "grow",
            )}
            style={{ flexBasis: 0 }}
          >
            <Image
              src={room.images[0] ?? "/images/property-exterior.jpg"}
              alt=""
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className={cn(
                "object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105",
                open ? "saturate-100" : "saturate-[0.35] brightness-75",
              )}
            />
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                open
                  ? "bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent"
                  : "bg-ink-950/55",
              )}
            />

            <h3 className="absolute inset-x-0 top-0 z-10">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={open}
                aria-controls={panelId}
                className={cn(
                  "flex w-full items-center justify-between gap-3 p-6 text-left text-xl font-medium tracking-[-0.02em] text-white md:p-7",
                  !open && "md:h-[36rem] md:items-end md:justify-start lg:h-[40rem]",
                )}
              >
                <span
                  className={cn(
                    "whitespace-nowrap transition-opacity duration-500",
                    !open && "md:[writing-mode:vertical-rl] md:rotate-180",
                  )}
                >
                  {room.name}
                </span>
                <span className="shrink-0 text-sm font-normal text-white/60 md:hidden">
                  {formatPHP(room.price_per_night)}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              className={cn(
                "absolute inset-x-0 bottom-0 z-10 p-6 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] md:p-8",
                open
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none invisible translate-y-6 opacity-0",
              )}
            >
              <p className="max-w-md text-[15px] leading-relaxed text-white/75 max-md:line-clamp-3">
                {room.description}
              </p>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                <dl className="flex gap-6 text-sm text-white/60 sm:gap-8">
                  <div>
                    <dt className="sr-only">Sleeps</dt>
                    <dd>{pluralize(room.max_guests, "guest")}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Beds</dt>
                    <dd>{room.bed_summary}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Size</dt>
                    <dd>{room.room_size} m²</dd>
                  </div>
                </dl>
                <Link
                  href={`/rooms/${room.slug}`}
                  className="group/link inline-flex h-12 items-center gap-2 rounded-full bg-sand-50 pl-5 pr-4 text-[15px] font-medium text-ink-950 transition-colors hover:bg-white"
                >
                  From {formatPHP(room.price_per_night)}
                  <span className="sr-only"> per night, view {room.name}</span>
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
