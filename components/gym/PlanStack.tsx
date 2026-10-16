"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { cn, formatPHP } from "@/lib/utils";
import type { GymPlan } from "@/types";

function period(plan: GymPlan) {
  return plan.billing_period === "visit" ? "per visit" : `per ${plan.billing_period}`;
}

/**
 * Membership plans as cards that pin and stack as you scroll: each new card
 * slides over the last, which recedes. Under reduced motion they are a plain
 * list (no sticky, no scaling).
 */
export function PlanStack({ plans }: { plans: GymPlan[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-plan-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card, {
            scale: 0.94,
            filter: "brightness(0.65)",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top 30%",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="space-y-6 motion-safe:space-y-[12vh]">
      {plans.map((plan, i) => (
        <article
          key={plan.id}
          data-plan-card
          style={{ top: `calc(7rem + ${i * 1.25}rem)` }}
          className={cn(
            "origin-top rounded-2xl border p-7 will-change-transform motion-safe:sticky sm:p-10",
            plan.featured
              ? "border-ember-400 bg-ember-500 text-iron-950"
              : "border-white/10 bg-iron-900 text-white",
          )}
        >
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3
                  className={cn(
                    "text-3xl font-black tracking-[-0.04em] sm:text-4xl",
                    plan.featured ? "text-iron-950" : "text-white",
                  )}
                >
                  {plan.name}
                </h3>
                {plan.badge && (
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      plan.featured ? "bg-iron-950 text-ember-400" : "bg-white/10 text-white/75",
                    )}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className={cn("mt-4 max-w-md text-base leading-relaxed", plan.featured ? "text-iron-950/75" : "text-white/60")}>
                {plan.description}
              </p>
            </div>

            <ul className="space-y-2.5 lg:col-span-4">
              {plan.perks.map((perk) => (
                <li
                  key={perk}
                  className={cn("flex gap-2.5 text-[15px]", plan.featured ? "text-iron-950/85" : "text-white/75")}
                >
                  <Check
                    className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-iron-950" : "text-ember-400")}
                    aria-hidden
                  />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-end justify-between gap-5 lg:col-span-3 lg:flex-col lg:items-end">
              <p className="lg:text-right">
                <span className="block text-[clamp(2.5rem,4vw,3.5rem)] font-black leading-none tracking-[-0.05em] tabular-nums">
                  {formatPHP(plan.price)}
                </span>
                <span className={cn("mt-1 block text-sm", plan.featured ? "text-iron-950/65" : "text-white/50")}>
                  {period(plan)}
                </span>
              </p>
              <Link
                href={`/gym/join?plan=${plan.slug}`}
                className={cn(
                  "group inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-bold transition-colors duration-300",
                  plan.featured
                    ? "bg-iron-950 text-white hover:bg-iron-800"
                    : "bg-white text-iron-950 hover:bg-ember-400",
                )}
              >
                Choose this plan
                <span className="sr-only">: {plan.name}</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
