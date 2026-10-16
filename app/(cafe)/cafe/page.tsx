import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CafeHero } from "@/components/cafe/CafeHero";
import { DishCarousel } from "@/components/cafe/DishCarousel";
import { OrderWays, type OrderWay } from "@/components/cafe/OrderWays";
import { ScaleFade } from "@/components/motion/ScaleFade";
import { TypeMarquee } from "@/components/motion/TypeMarquee";
import { CAFE, CAFE_PRICING, DELIVERY_AREA } from "@/lib/constants";
import { FEATURED_ITEM_IDS, MENU_CATEGORIES, MENU_ITEMS, getMenuItem } from "@/lib/data/menu";
import { formatPHP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${CAFE.name} — ${CAFE.tagline}`,
  description: CAFE.description,
};

const WAYS: OrderWay[] = [
  {
    title: "Straight to your room",
    body: "Staying with us? Enter your booking reference at checkout and the order goes on your room bill. Nothing to pay at the door.",
    fee: `+${Math.round(CAFE_PRICING.roomServiceRate * 100)}% room service`,
    image: "/images/cafe/room-service.jpg",
    alt: "An in-room dining tray from Azure Sands Cafe",
  },
  {
    title: "Pick up at the counter",
    body: "Order ahead, pick a time, and collect at the lobby-level counter. No fee, no queue.",
    fee: "No fee",
    image: "/images/cafe/interior.jpg",
    alt: "The coffee counter at Azure Sands Cafe",
  },
  {
    title: "Delivered along the beach",
    body: `Our own runners cover ${DELIVERY_AREA}. Minimum order ${formatPHP(CAFE_PRICING.deliveryMinimum)}, cash on delivery.`,
    fee: `${formatPHP(CAFE_PRICING.deliveryFee)} delivery`,
    image: "/images/white-beach.jpg",
    alt: "White Beach, Boracay",
  },
];

/** A small pill-shaped photo set inline with display type. */
function InlinePlate({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="group relative mx-[0.12em] inline-block h-[0.82em] w-[1.9em] overflow-hidden rounded-full align-[-0.08em]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="200px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
    </span>
  );
}

export default function CafeLandingPage() {
  const featured = FEATURED_ITEM_IDS.map((id) => getMenuItem(id)).filter((i) => i !== undefined);
  const marqueeDishes = MENU_ITEMS.filter((i) => i.tags.includes("bestseller")).map((i) => i.name);

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

      {/* Attention */}
      <CafeHero />

      {/* Interest */}
      <TypeMarquee
        items={marqueeDishes}
        label="Bestsellers at Azure Sands Cafe"
        className="border-y border-espresso-900/10 py-9 md:py-12"
        textClassName="text-[clamp(2.25rem,5.5vw,4.75rem)] font-semibold leading-none tracking-[-0.05em]"
        solidClassName="text-espresso-900"
        outlineClassName="text-transparent [-webkit-text-stroke:1.5px_var(--color-sunset-600)]"
        dotClassName="bg-sunset-500"
      />

      <section className="mx-auto max-w-7xl px-5 py-32 text-center sm:px-8 md:py-48">
        <h2 className="mx-auto max-w-6xl text-[clamp(2.25rem,5.6vw,5.5rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-espresso-900">
          Sizzling
          <InlinePlate src="/images/cafe/menu/sizzling-sisig.jpg" alt="Sizzling sisig" />
          plates, silog
          <InlinePlate src="/images/cafe/menu/tapsilog.jpg" alt="Tapsilog" />
          at any hour, and halo-halo
          <InlinePlate src="/images/cafe/menu/halo-halo.jpg" alt="Halo-halo" />
          for the heat.
        </h2>
        <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-espresso-700/75">
          Nothing sits under a heat lamp. Every plate goes on when the ticket prints, which is why
          the menu tells you how long each dish takes.
        </p>
        <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-8 gap-y-4 text-[15px] font-medium text-espresso-900">
          {MENU_CATEGORIES.map((category) => (
            <li key={category.key} className="flex items-center gap-2.5">
              <category.icon className="size-4 text-sunset-600" aria-hidden />
              {category.label}
            </li>
          ))}
        </ul>
      </section>

      {/* Desire */}
      <section className="border-y border-espresso-900/10 bg-sand-100/60">
        <div className="mx-auto max-w-7xl px-5 py-32 sm:px-8 md:py-48">
          <h2 className="max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-espresso-900">
            What the island keeps ordering
          </h2>
          <div className="mt-16 md:mt-20">
            <DishCarousel dishes={featured} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-32 sm:px-8 md:py-48">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 className="max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-espresso-900">
            Three ways to get it
          </h2>
          <p className="max-w-sm text-lg leading-relaxed text-espresso-700/75">
            Pick one at checkout. The price updates as you switch, so there are no surprises at the
            end.
          </p>
        </div>
        <div className="mt-16 md:mt-20">
          <OrderWays ways={WAYS} />
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-5 pb-32 sm:px-8 md:pb-48">
        <ScaleFade>
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[16/9]">
            <Image
              src="/images/cafe/interior.jpg"
              alt="The counter and dining room at Azure Sands Cafe"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso-950/85 via-espresso-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 grid gap-8 p-8 text-sand-50 sm:p-12 lg:grid-cols-12 lg:items-end">
              <h2 className="text-[clamp(2.25rem,4.4vw,4rem)] font-semibold leading-[1] tracking-[-0.055em] text-sand-50 lg:col-span-6">
                Come in, sit down, stay a while
              </h2>
              <dl className="grid gap-5 text-[15px] sm:grid-cols-3 lg:col-span-6">
                <div>
                  <dt className="text-sand-50/55">Where</dt>
                  <dd className="mt-1">Ground floor, Azure Sands Boracay, Station 2</dd>
                </div>
                <div>
                  <dt className="text-sand-50/55">When</dt>
                  <dd className="mt-1">{CAFE.hoursLabel}</dd>
                </div>
                <div>
                  <dt className="text-sand-50/55">Call</dt>
                  <dd className="mt-1">
                    <a href={`tel:${CAFE.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">
                      {CAFE.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </ScaleFade>
      </section>

      {/* Action */}
      <section className="grain relative isolate overflow-hidden bg-espresso-950">
        <div
          aria-hidden
          className="absolute -right-40 -top-40 size-[40rem] rounded-full bg-sunset-600/25 blur-[140px]"
        />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 py-36 sm:px-8 md:py-52 lg:grid-cols-12 lg:items-end">
          <h2 className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-sand-50 lg:col-span-8">
            Staying upstairs? Charge it to your room
          </h2>
          <div className="lg:col-span-4">
            <p className="text-lg leading-relaxed text-sand-50/70">
              Enter your booking reference at checkout. We verify the stay, the kitchen starts
              cooking, and the total lands on your room bill.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/cafe/menu"
                className="group inline-flex h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-sunset-700 px-8 text-base font-medium text-white transition-colors duration-300 hover:bg-sunset-800"
              >
                Order to my room
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/booking"
                className="group inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-sand-50/25 px-8 text-base font-medium text-sand-50 transition-colors duration-300 hover:border-sand-50/70"
              >
                Book a suite
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
