"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

export function GymHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "expo.out", duration: 1.3 } })
          .from("[data-gym-image]", { scale: 1.15, filter: "brightness(0.4)", duration: 2.2 })
          .from("[data-gym-word]", { yPercent: 115, stagger: 0.07 }, 0.15)
          .from("[data-gym-fade]", { opacity: 0, y: 20, stagger: 0.1 }, 0.55);

        gsap.to("[data-gym-image]", {
          scale: 1.08,
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  const words = ["Train", "where", "you", "stay."];

  return (
    <section
      ref={root}
      className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-iron-950"
    >
      <div data-gym-image className="absolute inset-0">
        <Image
          src="/images/gym/hero.jpg"
          alt="The cardio deck and strength racks at Azure Sands Fitness, palms behind the glass"
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale-[0.35] contrast-[1.1]"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgb(18_22_25/0.35),rgb(18_22_25/0.92))]"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-ember-500/25 blur-[120px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-36 text-center sm:px-8">
        <h1 className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-[0.22em] text-[clamp(3.25rem,9vw,9rem)] font-black leading-[0.9] tracking-[-0.055em] text-white">
          {words.map((word) => (
            <span key={word} className="inline-block overflow-hidden pb-[0.08em]">
              <span data-gym-word className={word === "stay." ? "inline-block text-ember-400" : "inline-block"}>
                {word}
              </span>
            </span>
          ))}
        </h1>
        <p data-gym-fade className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
          A full-equipment gym on the ground floor of Azure Sands Boracay. Free weights, a cardio
          deck, functional turf, and coached classes six days a week, open to the whole island.
        </p>
        <div data-gym-fade className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/gym/join"
            className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-ember-500 px-8 text-base font-bold text-iron-950 transition-colors duration-300 hover:bg-ember-400"
          >
            Start a membership
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <Link
            href="/gym/schedule"
            className="inline-flex h-14 items-center rounded-full border border-white/25 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-md transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
          >
            See the class schedule
          </Link>
        </div>
      </div>
    </section>
  );
}
