import type { Metadata } from "next";
import {
  GymCta,
  GymFacilities,
  GymFaq,
  GymHero,
  GymPlans,
  GymSchedulePreview,
  GymTestimonials,
  GymTrainers,
  GymZones,
} from "@/components/gym/sections";
import { GYM } from "@/lib/constants";
import { GYM_FAQS } from "@/lib/data/gym";

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
      <GymHero />
      <GymFacilities />
      <GymZones />
      <GymSchedulePreview />
      <GymPlans />
      <GymTrainers />
      <GymTestimonials />
      <GymFaq faqs={GYM_FAQS} />
      <GymCta />
    </>
  );
}
