"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

const tints = ["bg-ocean-300", "bg-sand-300", "bg-palm-300", "bg-ocean-100", "bg-sand-200", "bg-palm-200"];

function initials(name: string) {
  return name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** One quote at a time, with the other guests' monograms overlapping beside it. */
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const review = reviews[index];
  const count = reviews.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-4">
        <ul className="flex -space-x-4" aria-label="Guests">
          {reviews.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show review from ${r.guest_name}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "flex size-16 items-center justify-center rounded-full text-base font-bold tracking-[-0.02em] text-ink-950 ring-4 ring-ink-900 transition-transform duration-500 ease-[var(--ease-out-expo)] sm:size-[4.5rem]",
                  tints[i % tints.length],
                  i === index ? "relative z-10 -translate-y-2 scale-110" : "opacity-70 hover:opacity-100",
                )}
              >
                {initials(r.guest_name)}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next review"
            className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <ArrowRight className="size-4" aria-hidden />
          </button>
          <p className="ml-3 text-sm tabular-nums text-white/45">
            {index + 1} of {count}
          </p>
        </div>
      </div>

      <figure key={review.id} aria-live="polite" className="animate-fade-up lg:col-span-8">
        <div className="flex gap-1" role="img" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              aria-hidden
              className={cn(
                "size-5",
                i < review.rating ? "fill-sand-300 text-sand-300" : "text-white/20",
              )}
            />
          ))}
        </div>
        <blockquote className="mt-7 text-[clamp(1.625rem,3vw,2.625rem)] font-medium leading-[1.18] tracking-[-0.03em] text-sand-50">
          “{review.comment}”
        </blockquote>
        <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="text-lg font-medium text-white">{review.guest_name}</span>
          {review.stay_type && <span className="text-[15px] text-white/50">{review.stay_type}</span>}
        </figcaption>
      </figure>
    </div>
  );
}
