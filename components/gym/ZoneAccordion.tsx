"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Zone {
  image: string;
  title: string;
  body: string;
}

/**
 * The four training zones as slices that widen on hover or focus (desktop)
 * and stack as tappable bands on phones.
 */
export function ZoneAccordion({ zones }: { zones: Zone[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-[46rem] flex-col gap-2 md:h-[34rem] md:flex-row lg:h-[38rem]">
      {zones.map((zone, i) => {
        const open = active === i;
        const panelId = `zone-panel-${i}`;
        return (
          <div
            key={zone.title}
            onMouseEnter={() => setActive(i)}
            onFocusCapture={() => setActive(i)}
            className={cn(
              "group relative min-h-0 min-w-0 overflow-hidden rounded-xl bg-iron-900 transition-[flex-grow] duration-700 ease-[var(--ease-out-expo)]",
              open ? "grow-[4]" : "grow",
            )}
            style={{ flexBasis: 0 }}
          >
            <Image
              src={zone.image}
              alt=""
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className={cn(
                "object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105",
                open ? "grayscale-0" : "grayscale brightness-50",
              )}
            />
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                open ? "bg-gradient-to-t from-iron-950 via-iron-950/40 to-transparent" : "bg-iron-950/40",
              )}
            />

            <h3 className="absolute inset-x-0 top-0 z-10">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={open}
                aria-controls={panelId}
                className={cn(
                  "flex w-full items-center gap-4 p-6 text-left text-xl font-bold tracking-[-0.02em] text-white md:p-7",
                  !open && "md:h-[34rem] md:items-end lg:h-[38rem]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-0.5 shrink-0 bg-ember-500 transition-[width] duration-700",
                    open ? "w-8" : "w-4",
                    !open && "md:hidden",
                  )}
                />
                <span className={cn("whitespace-nowrap", !open && "md:rotate-180 md:[writing-mode:vertical-rl]")}>
                  {zone.title}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              className={cn(
                "absolute inset-x-0 bottom-0 z-10 p-6 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] md:p-8",
                open ? "translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-6 opacity-0",
              )}
            >
              <p className="max-w-md text-base leading-relaxed text-white/80">{zone.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
