import type { Metadata } from "next";
import { CoachCarousel } from "@/components/gym/CoachCarousel";
import { GymHero } from "@/components/gym/GymHero";
import { PlanStack } from "@/components/gym/PlanStack";
import { ZoneAccordion } from "@/components/gym/ZoneAccordion";
import {
  GymBento,
  GymCta,
  GymFaq,
  GymManifesto,
  GymMarquee,
  GymMemberQuotes,
  GymSchedulePreview,
  ZONES,
} from "@/components/gym/sections";
import { GYM } from "@/lib/constants";
import { GYM_FAQS, GYM_PLANS, GYM_TRAINERS } from "@/lib/data/gym";

export const metadata: Metadata = {
  title: `${GYM.name} — ${GYM.tagline}`,
  description: GYM.description,
};

export default function GymLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: GYM.name,
    description: GYM.description,
    telephone: GYM.phone,
    email: GYM.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Station 2, White Beach Path, Balabag",
      addressLocality: "Boracay Island, Malay",
      addressRegion: "Aklan",
      postalCode: "5608",
      addressCountry: "PH",
    },
    openingHours: "Mo-Su 05:00-23:00",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Attention */}
      <GymHero />

      {/* Interest */}
      <GymMarquee />
      <GymBento />
      <GymManifesto />

      {/* Desire */}
      <section className="mx-auto max-w-[90rem] px-5 pb-32 sm:px-8 md:pb-48">
        <h2 className="max-w-4xl text-[clamp(2.5rem,5.2vw,4.75rem)] font-black leading-[0.95] tracking-[-0.05em] text-white">
          Four zones under one roof
        </h2>
        <div className="mt-14 md:mt-20">
          <ZoneAccordion zones={ZONES} />
        </div>
      </section>

      <div className="border-y border-white/10 bg-iron-900/40">
        <GymSchedulePreview />
      </div>

      <section id="plans" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-32 sm:px-8 md:py-48">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 className="max-w-3xl text-[clamp(2.5rem,5.2vw,4.75rem)] font-black leading-[0.95] tracking-[-0.05em] text-white">
            Pick a plan, start this week
          </h2>
          <p className="max-w-sm text-lg leading-relaxed text-white/55">
            No joining fee, no lock-in beyond the term you pay for. Every membership includes all
            group classes.
          </p>
        </div>
        <div className="mt-16 md:mt-20">
          <PlanStack plans={GYM_PLANS} />
        </div>
      </section>

      <section
        id="trainers"
        className="grain relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-[radial-gradient(60%_60%_at_85%_20%,rgb(248_71_26/0.1),transparent_70%)] bg-iron-900/40"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-32 sm:px-8 md:py-48">
          <h2 className="sr-only">The coaches</h2>
          <CoachCarousel coaches={GYM_TRAINERS} />
          <GymMemberQuotes />
        </div>
      </section>

      {/* Action */}
      <GymFaq faqs={GYM_FAQS} />
      <GymCta />
    </>
  );
}
