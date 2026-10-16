"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { GymTrainer } from "@/types";

/** One coach at a time: overlapping portraits on the left, their story on the right. */
export function CoachCarousel({ coaches }: { coaches: GymTrainer[] }) {
  const [index, setIndex] = useState(0);
  const coach = coaches[index];
  const count = coaches.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-5">
        <ul className="flex items-end" aria-label="Coaches">
          {coaches.map((c, i) => {
            const current = i === index;
            return (
              <li key={c.id} className={cn(i > 0 && "-ml-10 sm:-ml-14", current && "relative z-10")}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${c.name}`}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    "relative block overflow-hidden rounded-full ring-4 ring-iron-950 transition-[width,height,filter] duration-700 ease-[var(--ease-out-expo)]",
                    current
                      ? "size-44 sm:size-56"
                      : "size-28 grayscale hover:grayscale-0 sm:size-36",
                  )}
                >
                  <Image src={c.image} alt="" fill sizes="224px" className="object-cover" />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous coach"
            className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-ember-400 hover:text-ember-400"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next coach"
            className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-ember-400 hover:text-ember-400"
          >
            <ArrowRight className="size-4" aria-hidden />
          </button>
          <p className="ml-3 text-sm tabular-nums text-white/45">
            {index + 1} of {count}
          </p>
        </div>
      </div>

      <figure key={coach.id} aria-live="polite" className="animate-fade-up lg:col-span-7">
        <p className="text-base font-bold text-ember-400">{coach.specialty}</p>
        <blockquote className="mt-5 text-[clamp(1.5rem,2.6vw,2.375rem)] font-medium leading-[1.2] tracking-[-0.03em] text-white">
          {coach.bio}
        </blockquote>
        <figcaption className="mt-8">
          <span className="block text-xl font-bold text-white">{coach.name}</span>
          <span className="mt-1 block text-[15px] text-white/50">{coach.certification}</span>
        </figcaption>
      </figure>
    </div>
  );
}
