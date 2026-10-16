"use client";

import { ArrowLeft, ArrowRight, Check, Clock, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cafe/CartProvider";
import { cn, formatPHP } from "@/lib/utils";
import type { MenuItem } from "@/types";

/**
 * House favourites, one at a time: overlapping round plates on the left, the
 * dish written up on the right, with a direct add-to-order.
 */
export function DishCarousel({ dishes }: { dishes: MenuItem[] }) {
  const { add } = useCart();
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState<string | null>(null);
  const dish = dishes[index];
  const count = dishes.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(null), 1800);
    return () => window.clearTimeout(t);
  }, [added]);

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-6">
        <ul className="flex flex-wrap items-center" aria-label="House favourites">
          {dishes.map((d, i) => {
            const current = i === index;
            return (
              <li key={d.id} className={cn(i > 0 && "-ml-6 sm:-ml-8", current && "relative z-10")}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${d.name}`}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    "relative block overflow-hidden rounded-full ring-4 ring-sand-50 transition-[width,height,filter] duration-700 ease-[var(--ease-out-expo)]",
                    current ? "size-40 sm:size-52" : "size-20 saturate-50 hover:saturate-100 sm:size-24",
                  )}
                >
                  <Image src={d.image} alt="" fill sizes="208px" className="object-cover" />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous dish"
            className="flex size-12 items-center justify-center rounded-full border border-espresso-900/20 text-espresso-900 transition-colors hover:border-espresso-900 hover:bg-espresso-900 hover:text-sand-50"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next dish"
            className="flex size-12 items-center justify-center rounded-full border border-espresso-900/20 text-espresso-900 transition-colors hover:border-espresso-900 hover:bg-espresso-900 hover:text-sand-50"
          >
            <ArrowRight className="size-4" aria-hidden />
          </button>
          <p className="ml-3 text-sm tabular-nums text-espresso-700/55">
            {index + 1} of {count}
          </p>
        </div>
      </div>

      <figure key={dish.id} aria-live="polite" className="animate-fade-up lg:col-span-6">
        <figcaption className="text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1] tracking-[-0.05em] text-espresso-900">
          {dish.name}
        </figcaption>
        <blockquote className="mt-6 max-w-xl text-xl leading-relaxed text-espresso-700/85">
          {dish.description}
        </blockquote>
        <p className="mt-6 flex items-center gap-5 text-[15px] text-espresso-700/65">
          <span className="text-2xl font-semibold tracking-[-0.03em] text-espresso-900 tabular-nums">
            {formatPHP(dish.price)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden />
            {dish.prep_minutes} min
          </span>
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!dish.available}
            onClick={() => {
              add(dish.id);
              setAdded(dish.id);
            }}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-espresso-900 px-6 text-[15px] font-medium text-sand-50 transition-colors duration-300 hover:bg-espresso-800 disabled:opacity-50"
          >
            {added === dish.id ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
            {added === dish.id ? "Added to your order" : "Add to order"}
          </button>
          <Link
            href="/cafe/menu"
            className="inline-flex h-12 items-center rounded-full border border-espresso-900/20 px-6 text-[15px] font-medium text-espresso-900 transition-colors duration-300 hover:border-espresso-900"
          >
            See the full menu
          </Link>
        </div>
      </figure>
    </div>
  );
}
