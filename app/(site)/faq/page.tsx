import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { FAQS } from "@/lib/data/faqs";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about check-in, payments, cancellations, transfers, kids, pets, Wi-Fi, and long stays at Azure Sands Boracay Condotel.",
};

export default function FaqPage() {
  const categories = [...new Set(FAQS.map((f) => f.category))];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-8 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="font-display text-[clamp(2.75rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink-900 text-balance">
        Frequently asked questions
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-500">
        Everything guests usually ask before booking. Can’t find your answer?{" "}
        <Link
          href="/contact"
          className="font-medium text-ocean-700 underline-offset-4 hover:underline"
        >
          Contact us
        </Link>{" "}
        — a real person replies.
      </p>

      <div className="mt-12 space-y-10">
        {categories.map((category) => (
          <section key={category} aria-labelledby={`faq-${category}`}>
            <h2
              id={`faq-${category}`}
              className="mb-4 font-display text-xl font-medium text-ink-900"
            >
              {category}
            </h2>
            <Accordion
              items={FAQS.filter((f) => f.category === category).map((f) => ({
                question: f.question,
                answer: f.answer,
              }))}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
