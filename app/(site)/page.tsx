import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HeroSearch } from "@/components/home/HeroSearch";
import { IslandPinned } from "@/components/home/IslandPinned";
import { Marquee } from "@/components/home/Marquee";
import { ReviewCarousel } from "@/components/home/ReviewCarousel";
import { ScrubReveal } from "@/components/motion/ScrubReveal";
import { SuiteAccordion } from "@/components/home/SuiteAccordion";
import {
  BentoSection,
  CtaSection,
  FaqSection,
  OnPropertySection,
} from "@/components/home/sections";
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
    { "@type": "LocationFeatureSpecification", name: "On-site restaurant", value: true },
    { "@type": "LocationFeatureSpecification", name: "Fitness centre", value: true },
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

      {/* Attention */}
      <Hero />

      <section id="plan" aria-labelledby="plan-heading" className="relative z-10 -mt-16 scroll-mt-28 px-3 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-sand-50 p-6 shadow-lift sm:p-8 lg:flex lg:items-end lg:gap-10 lg:p-10">
          <h2
            id="plan-heading"
            className="mb-6 shrink-0 text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-ink-900 lg:mb-1 lg:w-44"
          >
            When are you coming?
          </h2>
          <div className="flex-1">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Interest */}
      <div className="pt-24 md:pt-32">
        <Marquee />
      </div>
      <BentoSection />

      <div className="grain ambient-lagoon overflow-hidden">
        <section className="relative z-10 px-5 py-32 sm:px-8 md:py-48">
          <ScrubReveal
            text="We built Azure Sands for the trip that always felt too short. Suites with real kitchens and balconies, a pool for the slow hours, White Beach a short walk away, and a small team that knows your name by day two."
            accent={["short", "two"]}
          />
        </section>

        {/* Desire */}
        <section className="relative z-10 px-5 pb-32 sm:px-8 md:pb-48">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white">
                Four ways to stay
              </h2>
              <Link
                href="/rooms"
                className="group inline-flex items-center gap-2 border-b border-white/25 pb-1 text-lg text-white transition-colors hover:border-ocean-300 hover:text-ocean-200"
              >
                Compare every suite
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
            <div className="mt-14 md:mt-20">
              <SuiteAccordion rooms={rooms.slice(0, 4)} />
            </div>
          </div>
        </section>
      </div>

      <OnPropertySection />

      <section className="border-t border-sand-200">
        <div className="mx-auto max-w-7xl px-5 py-32 sm:px-8 md:py-48">
          <IslandPinned />
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="grain ambient-lagoon overflow-hidden px-5 py-32 sm:px-8 md:py-48">
          <div className="relative z-10 mx-auto max-w-7xl">
            <h2 className="sr-only">Guest reviews</h2>
            <ReviewCarousel reviews={reviews} />
          </div>
        </section>
      )}

      <FaqSection />

      {/* Action */}
      <CtaSection />
    </>
  );
}
