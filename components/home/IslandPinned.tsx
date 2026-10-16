"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { ATTRACTIONS } from "@/lib/data/attractions";
import { SITE } from "@/lib/constants";
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

const mapsLink = "https://www.google.com/maps/search/?api=1&query=White+Beach+Station+2+Boracay";

/**
 * Pinned split: the heading holds on the left while the island's landmarks
 * scroll past on the right. Pinning only runs on wide screens with motion allowed.
 */
export function IslandPinned() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        ScrollTrigger.create({
          trigger: "[data-pin-list]",
          start: "top 128px",
          end: () => `bottom ${128 + (root.current?.querySelector<HTMLElement>("[data-pin-title]")?.offsetHeight ?? 0)}px`,
          pin: "[data-pin-title]",
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-pin-card]").forEach((card) => {
          gsap.from(card, {
            y: 64,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <div data-pin-title>
          <h2 className="text-[clamp(2.5rem,4.6vw,4.25rem)] font-medium leading-[1] tracking-[-0.045em] text-ink-900">
            In the heart of it, away from the noise
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-500">
            Station 2 energy when you want it, island quiet when you do not.
            Walk to dinner, sleep to waves instead of basslines.
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="group mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-ink-900 pl-6 pr-5 text-[15px] font-medium text-sand-50 transition-colors duration-300 hover:bg-ocean-800"
          >
            Open in Google Maps
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-stone-400">
            {SITE.address}
          </p>
        </div>
      </div>

      <ul data-pin-list className="space-y-4 lg:col-span-7">
        {ATTRACTIONS.map((spot) => (
          <li
            key={spot.name}
            data-pin-card
            className="group rounded-[1.75rem] border border-sand-200 bg-white p-7 transition-colors duration-500 hover:border-ocean-300 sm:p-9"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <h3 className="text-2xl font-medium tracking-[-0.03em] text-ink-900 sm:text-3xl">
                {spot.name}
              </h3>
              <p className="shrink-0 text-lg font-medium text-ocean-600 sm:text-right">
                {spot.distance.replace("*", "")}
              </p>
            </div>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-500">
              {spot.description}
            </p>
          </li>
        ))}
        <li data-pin-card className="overflow-hidden rounded-[1.75rem] border border-sand-200 bg-sand-100">
          <iframe
            src={SITE.mapsEmbedUrl}
            title="Map showing the location of Azure Sands Boracay Condotel"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0 grayscale-[0.6] sm:h-96"
          />
        </li>
        <li className="px-2 text-xs text-stone-400">
          Distances are estimates until the final property address is confirmed.
        </li>
      </ul>
    </div>
  );
}
