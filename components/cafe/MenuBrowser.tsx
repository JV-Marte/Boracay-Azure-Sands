"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cafe/CartProvider";
import { Badge } from "@/components/ui/Badge";
import { MENU_CATEGORIES, MENU_ITEMS, MENU_TAG_LABELS } from "@/lib/data/menu";
import { cn, formatPHP } from "@/lib/utils";
import type { MenuItem, MenuTag } from "@/types";

const TAG_TONES: Record<MenuTag, "sunset" | "red" | "palm" | "sand"> = {
  bestseller: "sunset",
  spicy: "red",
  vegetarian: "palm",
  "chef-pick": "sand",
};

function ItemCard({ item, disabled }: { item: MenuItem; disabled: boolean }) {
  const { add, setQty, resolved } = useCart();
  const line = resolved.find((l) => l.item.id === item.id);
  const qty = line?.qty ?? 0;

  return (
    <article className="flex overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft">
      <div className="relative aspect-square w-28 shrink-0 sm:w-36">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="144px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-stone-900">{item.name}</h3>
          <p className="shrink-0 font-display text-lg font-medium text-ink-900">
            {formatPHP(item.price)}
          </p>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-500">
          {item.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} tone={TAG_TONES[tag]}>
              {MENU_TAG_LABELS[tag]}
            </Badge>
          ))}
          <Badge tone="neutral">{item.prep_minutes} min</Badge>
        </div>

        <div className="mt-auto flex items-center justify-end pt-3">
          {qty === 0 ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => add(item.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-stone-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:pointer-events-none disabled:opacity-40"
            >
              <Plus className="size-4" aria-hidden />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full border border-stone-300 p-1">
              <button
                type="button"
                aria-label={`Remove one ${item.name}`}
                onClick={() => setQty(item.id, qty - 1)}
                className="grid size-7 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
              >
                <Minus className="size-4" aria-hidden />
              </button>
              <span className="w-6 text-center text-sm font-semibold tabular-nums text-stone-900">
                {qty}
              </span>
              <button
                type="button"
                aria-label={`Add one ${item.name}`}
                onClick={() => add(item.id)}
                className="grid size-7 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
              >
                <Plus className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function MenuBrowser({ kitchenOpen }: { kitchenOpen: boolean }) {
  const { count, subtotal, hydrated } = useCart();
  const [active, setActive] = useState<string>(MENU_CATEGORIES[0].key);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const grouped = useMemo(
    () =>
      MENU_CATEGORIES.map((category) => ({
        category,
        items: MENU_ITEMS.filter((i) => i.category === category.key),
      })).filter((g) => g.items.length > 0),
    [],
  );

  // Highlight the tab for whichever section is currently under the header.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-120px 0px -70% 0px" },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="sticky top-20 z-30 -mx-4 border-b border-espresso-900/10 bg-sand-50/95 px-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-3">
          {grouped.map(({ category }) => (
            <a
              key={category.key}
              href={`#${category.key}`}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                active === category.key
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-sand-100",
              )}
            >
              {category.label}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-14 py-10">
        {grouped.map(({ category, items }) => (
          <section
            key={category.key}
            id={category.key}
            ref={(el) => {
              sectionRefs.current[category.key] = el;
            }}
            className="scroll-mt-32"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-sunset-50">
                <category.icon className="size-5 text-sunset-600" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-2xl font-medium text-ink-900">
                  {category.label}
                </h2>
                <p className="text-sm text-stone-500">{category.blurb}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} disabled={!kitchenOpen} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Sticky cart bar */}
      {hydrated && count > 0 && (
        <div className="sticky bottom-4 z-40 mx-auto max-w-lg">
          <Link
            href="/cafe/checkout"
            className="flex items-center justify-between gap-4 rounded-full bg-stone-900 py-3 pl-5 pr-3 text-white shadow-lift transition-colors hover:bg-stone-800"
          >
            <span className="flex items-center gap-2.5 text-sm font-medium">
              <ShoppingBag className="size-4.5" aria-hidden />
              {count} {count === 1 ? "item" : "items"} · {formatPHP(subtotal)}
            </span>
            <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-sunset-500 px-4 text-sm font-semibold">
              <Check className="size-4" aria-hidden />
              Checkout
            </span>
          </Link>
        </div>
      )}
    </>
  );
}
