"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "expo.out", duration: 1.4 } })
          .from("[data-hero-image]", { scale: 1.12, duration: 2.4 })
          .from("[data-hero-line]", { yPercent: 110, stagger: 0.12 }, 0.2)
          .from("[data-hero-fade]", { opacity: 0, y: 24, stagger: 0.1 }, 0.6);

        // Image drifts slower than the page and the copy lifts away as you leave the hero
        gsap.to("[data-hero-media]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 20%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink-950"
    >
      <div data-hero-media className="absolute inset-0 -z-0">
        <div data-hero-image className="absolute inset-0">
          <Image
            src="/images/boracay-hero-v2.jpg"
            alt="White Beach, Boracay: turquoise water meeting powder-white sand under a leaning palm"
            fill
            priority
            sizes="100vw"
            className="object-cover saturate-[0.8] contrast-[1.08]"
          />
        </div>
      </div>
      {/* Dark radial wash: bright at the horizon, deep at the edges, fully ink at the base */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgb(5_15_16/0.25),rgb(5_15_16/0.78))]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink-950"
      />

      <div
        data-hero-copy
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-36 text-center sm:px-8"
      >
        <h1 className="mx-auto max-w-6xl text-[clamp(3rem,6.4vw,6.25rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              Your island stay,
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block text-ocean-200">
              in the heart of Boracay
            </span>
          </span>
        </h1>
        <p
          data-hero-fade
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          Island suites with kitchens and balconies, a pool for the slow hours,
          and White Beach a short stroll away.
        </p>
        <div data-hero-fade className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#plan"
            className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-ocean-300 px-8 text-base font-medium text-ink-950 transition-colors duration-300 hover:bg-ocean-200"
          >
            Check availability
            <ArrowDown
              className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/rooms"
            className="group inline-flex h-14 items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-8 text-base font-medium text-white backdrop-blur-md transition-colors duration-300 hover:border-white/70 hover:bg-white/20"
          >
            Explore the suites
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
