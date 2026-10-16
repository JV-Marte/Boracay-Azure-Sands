import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { HeroSearch } from "@/components/home/HeroSearch";
import {
  AmenitiesSection,
  CtaSection,
  FaqPreview,
  GalleryPreview,
  LocationSection,
  ReviewsSection,
  WhyStay,
} from "@/components/home/sections";
import { RoomCard } from "@/components/rooms/RoomCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/constants";
import { listApprovedReviews } from "@/services/reviews";
import { listRooms } from "@/services/rooms";

export const dynamic = "force-dynamic";

const lodgingJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${SITE.url}/images/boracay-hero.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Station 2, White Beach Path, Balabag",
    addressLocality: "Boracay Island, Malay",
    addressRegion: "Aklan",
    postalCode: "5608",
    addressCountry: "PH",
  },
  checkinTime: "14:00",
  checkoutTime: "11:00",
  priceRange: "₱₱",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Swimming pool", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
  ],
};

export default async function HomePage() {
  const [rooms, reviews] = await Promise.all([
    listRooms(),
    listApprovedReviews(6),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
      />

      {/* Hero */}
      <section className="relative isolate flex min-h-[92svh] items-center">
        <Image
          src="/images/about-exterior-v2.png"
          alt="Azure Sands condotel exterior surrounded by tropical greenery"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/60 via-ocean-950/25 to-ocean-950/50" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
              Boutique condotel · White Beach, Boracay
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl text-balance">
              {SITE.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Spacious island suites with kitchens and balconies, a pool for
              lazy afternoons, and the beach a short stroll away — for
              honeymoons, family trips, and month-long workations.
            </p>
          </div>
          <div className="mt-10 max-w-4xl">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Featured rooms */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Rooms & suites"
            title="Find the suite that fits your trip"
            description="Four ways to stay — from a cozy studio for two to a loft that sleeps the whole barkada."
          />
          <ButtonLink href="/rooms" variant="outline" size="sm">
            All rooms
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.slice(0, 4).map((room, i) => (
            <RoomCard key={room.id} room={room} priority={i < 2} />
          ))}
        </div>
      </section>

      <WhyStay />
      <AmenitiesSection />
      <GalleryPreview />
      <LocationSection />
      <ReviewsSection reviews={reviews} />
      <FaqPreview />
      <CtaSection />
    </>
  );
}
