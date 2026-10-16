import {
  ArrowRight,
  HeartHandshake,
  MapPin,
  Percent,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AMENITIES } from "@/lib/data/amenities";
import { ATTRACTIONS } from "@/lib/data/attractions";
import { FAQS } from "@/lib/data/faqs";
import { GALLERY_IMAGES } from "@/lib/data/gallery";
import { SITE } from "@/lib/constants";
import type { Review } from "@/types";

// ---------------------------------------------------------------------------

const reasons = [
  {
    icon: MapPin,
    title: "Steps from White Beach",
    body: "Wake up, grab your towel, and you're on the world's most famous sunset beach before your coffee cools.",
  },
  {
    icon: UtensilsCrossed,
    title: "Suites that live like homes",
    body: "Kitchens, dining tables, and real workspaces — stay a weekend or a season without feeling boxed in.",
  },
  {
    icon: HeartHandshake,
    title: "Hospitality that remembers you",
    body: "A small team that arranges transfers, books island hopping, and knows your name by day two.",
  },
  {
    icon: Percent,
    title: "Honest, flexible pricing",
    body: "Clear nightly rates, no hidden charges, free cancellation up to 7 days out, and 10% off stays of a week or more.",
  },
];

export function WhyStay() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Why Azure Sands"
        title="Everything a hotel offers, with room to actually live"
        description="We built Azure Sands for travelers who want the ease of a hotel and the space of a home — in the best location on the island."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason) => (
          <Card key={reason.title} className="p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-ocean-50">
              <reason.icon className="size-5 text-ocean-600" aria-hidden />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-stone-900">
              {reason.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">{reason.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function AmenitiesSection() {
  const featured = AMENITIES.filter((a) => a.featured);
  return (
    <section className="bg-sand-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Amenities"
          title="The details that make island life easy"
        />
        <ul className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((amenity) => (
            <li key={amenity.key} className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-soft">
                <amenity.icon className="size-4.5 text-palm-600" aria-hidden />
              </div>
              <div>
                <p className="font-medium text-stone-900">{amenity.label}</p>
                {amenity.description && (
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">
                    {amenity.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function GalleryPreview() {
  const wanted = [
    "ocean-view-suite/view",
    "premium-loft/interior",
    "family-suite/interior",
    "ocean-view-suite/bathroom",
    "deluxe-studio/interior",
    "premium-loft/bedroom",
  ];
  const picks = wanted.flatMap((path) => {
    const image = GALLERY_IMAGES.find((i) => i.src.includes(path));
    return image ? [image] : [];
  });
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          eyebrow="Gallery"
          title="A first look at the island life"
        />
        <ButtonLink href="/gallery" variant="outline" size="sm">
          View full gallery
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {picks.map((image, i) => (
          <Link
            key={image.src}
            href="/gallery"
            className={`group relative block overflow-hidden rounded-2xl ${
              i === 0 ? "col-span-2 row-span-2 sm:col-span-1" : ""
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={800}
              height={534}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function LocationSection() {
  return (
    <section className="bg-ocean-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Location"
          title="In the heart of it, away from the noise"
          description="Station 2 energy when you want it, island quiet when you don't. Here's what's around Azure Sands."
          className="[&_h2]:text-white [&_p:last-child]:text-ocean-200/80"
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="overflow-hidden rounded-2xl">
            <iframe
              src={SITE.mapsEmbedUrl}
              title="Map showing the location of Azure Sands Boracay Condotel"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0 sm:h-full sm:min-h-96"
            />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ATTRACTIONS.map((spot) => (
              <li
                key={spot.name}
                className="rounded-2xl bg-ocean-900/60 p-4 ring-1 ring-ocean-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">{spot.name}</h3>
                  <span className="shrink-0 rounded-full bg-ocean-800 px-2 py-0.5 text-[11px] font-medium text-ocean-200">
                    {spot.distance}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ocean-200/75">
                  {spot.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-xs text-ocean-300/60">
          *Distances are placeholders until the final property address is confirmed.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Guest reviews"
        title="Stories from the balcony"
        description="Real feedback from recent stays — the good and the honest."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 6).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function FaqPreview() {
  const items = FAQS.slice(0, 5).map((f) => ({
    question: f.question,
    answer: f.answer,
  }));
  return (
    <section className="bg-sand-50">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
        <Accordion items={items} className="mt-10" />
        <p className="mt-6 text-center text-sm text-stone-500">
          More questions?{" "}
          <Link
            href="/faq"
            className="font-medium text-ocean-700 underline-offset-4 hover:underline"
          >
            Read the full FAQ
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="font-medium text-ocean-700 underline-offset-4 hover:underline"
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/beach-sunset.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/80 via-ocean-950/60 to-ocean-950/30" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
            The sunset is better from your own balcony
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            Check your dates and lock in your island suite — free cancellation
            up to 7 days before check-in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/booking" variant="sunset" size="lg">
              Book your stay
            </ButtonLink>
            <ButtonLink
              href="/rooms"
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:border-white hover:bg-white/20 hover:text-white"
            >
              Browse rooms
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
