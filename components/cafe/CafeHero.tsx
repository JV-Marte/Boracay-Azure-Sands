"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CAFE } from "@/lib/constants";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/** Editorial split: type on the left, one tall photograph on the right, lots of air. */
export function CafeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "expo.out", duration: 1.3 } })
          .from("[data-cafe-photo]", { clipPath: "inset(18% 12% 18% 12% round 2rem)", duration: 1.8 })
          .from("[data-cafe-photo] img", { scale: 1.25, duration: 2.2 }, 0)
          .from("[data-cafe-line]", { yPercent: 110, stagger: 0.1 }, 0.2)
          .from("[data-cafe-fade]", { opacity: 0, y: 18, stagger: 0.1 }, 0.6);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto max-w-[90rem] px-5 pb-32 pt-16 sm:px-8 md:pb-48 md:pt-24">
      <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7 lg:pr-10">
          <h1 className="text-[clamp(1.875rem,8.4vw,2.75rem)] font-semibold sm:text-[clamp(2.75rem,4.6vw,4.75rem)] leading-[0.98] tracking-[-0.055em] text-espresso-900">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-cafe-line className="block">
                Island comfort food,
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-cafe-line className="block text-sunset-700">
                brought to your room
              </span>
            </span>
          </h1>
          <p data-cafe-fade className="mt-8 max-w-xl text-lg leading-relaxed text-espresso-700/80">
            All-day breakfast, Filipino favourites, sizzling plates, and hand-stretched pizza from
            the ground floor of Azure Sands Boracay. Open to the whole island, not just to guests.
          </p>
          <div data-cafe-fade className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cafe/menu"
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-sunset-700 px-8 text-base font-medium text-white transition-colors duration-300 hover:bg-sunset-800"
            >
              Start an order
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/cafe/track"
              className="inline-flex h-14 items-center justify-center rounded-full border border-espresso-900/20 px-8 text-base font-medium text-espresso-900 transition-colors duration-300 hover:border-espresso-900 hover:bg-espresso-900/5"
            >
              Track an order
            </Link>
          </div>
          <p data-cafe-fade className="mt-12 text-sm text-espresso-700/60">
            {CAFE.hoursLabel}
          </p>
        </div>

        <div className="lg:col-span-5">
          <div
            data-cafe-photo
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand-200"
          >
            <Image
              src="/images/cafe/hero.jpg"
              alt="The dining room at Azure Sands Cafe, rattan pendants over wooden tables"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
