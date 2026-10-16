import { ArrowRight, BedDouble, Bike, Clock, MapPin, Phone, Store } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CAFE, CAFE_PRICING, DELIVERY_AREA } from "@/lib/constants";
import { FEATURED_ITEM_IDS, MENU_CATEGORIES, MENU_ITEMS, getMenuItem } from "@/lib/data/menu";
import { formatPHP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${CAFE.name} — ${CAFE.tagline}`,
  description: CAFE.description,
};

const SECTION = "mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8";

const WAYS = [
  {
    icon: BedDouble,
    title: "Straight to your room",
    body: "Staying with us? Enter your booking reference at checkout and the order goes on your room bill. Nothing to pay at the door.",
    fee: "+10% room service",
  },
  {
    icon: Store,
    title: "Pick up at the counter",
    body: "Order ahead, pick a time, and collect at the lobby-level counter. No fee, no queue.",
    fee: "No fee",
  },
  {
    icon: Bike,
    title: "Delivered along the beach",
    body: `Our own runners cover ${DELIVERY_AREA}. Minimum order ${formatPHP(CAFE_PRICING.deliveryMinimum)}, cash on delivery.`,
    fee: `${formatPHP(CAFE_PRICING.deliveryFee)} delivery`,
  },
];

export default function CafeLandingPage() {
  const featured = FEATURED_ITEM_IDS.map((id) => getMenuItem(id)).filter(
    (i) => i !== undefined,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: CAFE.name,
    description: CAFE.description,
    servesCuisine: ["Filipino", "International"],
    telephone: CAFE.phone,
    email: CAFE.email,
    priceRange: "₱₱",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Station 2, White Beach Path, Balabag",
      addressLocality: "Boracay Island, Malay",
      addressRegion: "Aklan",
      postalCode: "5608",
      addressCountry: "PH",
    },
    openingHours: "Mo-Su 06:00-22:00",
    hasMenu: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/cafe/menu`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/cafe/hero.jpg"
          alt="The dining room at Azure Sands Cafe"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/65 to-stone-950/20" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-medium tracking-[-0.03em] text-white text-balance sm:text-6xl">
              {CAFE.tagline}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              All-day breakfast, Filipino favourites, sizzling plates, and hand-stretched pizza
              from the ground floor of Azure Sands Boracay — open to the island, not just to guests.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/cafe/menu"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sunset-500 px-7 text-base font-semibold text-white transition-colors hover:bg-sunset-600"
              >
                Start an order
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/cafe/track"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-7 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Track an order
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/15 pt-6">
              {[
                { label: "On the menu", value: `${MENU_ITEMS.length} dishes` },
                { label: "Kitchen hours", value: "6 AM – 10 PM" },
                { label: "Ways to order", value: "3" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-medium text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Three ways to order */}
      <section className={SECTION}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sunset-600">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] text-ink-900 text-balance sm:text-4xl">
            Three ways to get it
          </h2>
          <p className="mt-3.5 text-base leading-relaxed text-stone-500 sm:text-lg">
            Pick one at checkout. The price updates as you switch, so there are no surprises at
            the end.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {WAYS.map((way) => (
            <article
              key={way.title}
              className="rounded-2xl border border-stone-200/80 bg-white p-7 shadow-soft"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-sunset-50">
                <way.icon className="size-5 text-sunset-600" aria-hidden />
              </span>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-medium text-ink-900">{way.title}</h3>
                <Badge tone="sand">{way.fee}</Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{way.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Featured dishes */}
      <section className="border-y border-sand-200 bg-sand-50">
        <div className={SECTION}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sunset-600">
                Most ordered
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] text-ink-900 sm:text-4xl">
                What the island keeps ordering
              </h2>
            </div>
            <Link
              href="/cafe/menu"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sunset-700 hover:text-sunset-800"
            >
              See the full menu
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <Link
                key={item.id}
                href="/cafe/menu"
                className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft transition-shadow hover:shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-stone-900">{item.name}</h3>
                    <p className="shrink-0 font-display text-lg font-medium text-ink-900">
                      {formatPHP(item.price)}
                    </p>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-500">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories + visit */}
      <section className={SECTION}>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/cafe/interior.jpg"
              alt="The coffee counter at Azure Sands Cafe"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sunset-600">
              The kitchen
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] text-ink-900 sm:text-4xl">
              Seven sections, cooked to order
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-500 sm:text-lg">
              Nothing sits under a heat lamp. Every plate goes on when the ticket prints, which is
              why the menu tells you how long each dish takes.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {MENU_CATEGORIES.map((category) => (
                <li key={category.key} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sand-100">
                    <category.icon className="size-4.5 text-sunset-600" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-stone-700">{category.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-2.5 border-t border-stone-200 pt-6 text-sm text-stone-600">
              <p className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-sunset-500" aria-hidden />
                {CAFE.address}
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-sunset-500" aria-hidden />
                {CAFE.hoursLabel}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-sunset-500" aria-hidden />
                <a href={`tel:${CAFE.phone.replace(/\s/g, "")}`} className="hover:text-stone-900">
                  {CAFE.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Room service CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-3xl bg-stone-900 lg:grid-cols-2">
            <div className="px-8 py-14 sm:px-12">
              <h2 className="font-display text-3xl font-medium tracking-[-0.03em] text-white text-balance sm:text-4xl">
                Staying upstairs? Charge it to your room
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Enter your booking reference at checkout. We verify the stay, the kitchen starts
                cooking, and the total lands on your room bill — no card, no cash at the door.
              </p>
              <Link
                href="/cafe/menu"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sunset-500 px-7 text-base font-semibold text-white transition-colors hover:bg-sunset-600"
              >
                Order to my room
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="relative min-h-64">
              <Image
                src="/images/cafe/room-service.jpg"
                alt="An in-room dining tray from Azure Sands Cafe"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
