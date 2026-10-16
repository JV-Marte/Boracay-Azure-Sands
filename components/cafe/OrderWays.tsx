"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export interface OrderWay {
  title: string;
  body: string;
  fee: string;
  image: string;
  alt: string;
}

const tones = ["bg-espresso-900 text-sand-50", "bg-sand-200 text-espresso-900", "bg-sunset-700 text-white"];

/**
 * The three ways to get an order, as full-width cards that pin and stack:
 * each new card slides over the last, which tilts back and dims. Under
 * reduced motion they are a plain list.
 */
export function OrderWays({ ways }: { ways: OrderWay[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-way-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card, {
            scale: 0.92,
            rotate: i % 2 === 0 ? -1.5 : 1.5,
            filter: "brightness(0.7)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 25%", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="space-y-6 motion-safe:space-y-[14vh]">
      {ways.map((way, i) => (
        <article
          key={way.title}
          data-way-card
          style={{ top: `calc(7.5rem + ${i * 1.5}rem)` }}
          className={cn(
            "grid overflow-hidden rounded-[2rem] will-change-transform motion-safe:sticky md:grid-cols-2",
            tones[i % tones.length],
          )}
        >
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-12">
            <p className="text-sm font-medium opacity-70">{way.fee}</p>
            <div>
              <h3 className="text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1] tracking-[-0.05em] text-inherit">
                {way.title}
              </h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed opacity-80">{way.body}</p>
            </div>
          </div>
          <div className="relative min-h-72 md:min-h-[26rem]">
            <Image src={way.image} alt={way.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </article>
      ))}
    </div>
  );
}
