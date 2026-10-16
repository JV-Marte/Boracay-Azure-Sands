import type { Metadata } from "next";
import { Heart, Leaf, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import { CtaSection } from "@/components/home/sections";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Azure Sands Boracay Condotel — a family-run boutique property steps from White Beach, built for travelers who want to live the island, not just visit it.",
};

const highlights = [
  {
    icon: MapPin,
    title: "The right spot on the island",
    body: "Close enough to Station 2 to walk to dinner, far enough that you sleep to waves instead of basslines.",
  },
  {
    icon: Users,
    title: "Made for every kind of stay",
    body: "Studios for two, suites for families, a loft for five — with kitchens and workspaces for stays of a week or a season.",
  },
  {
    icon: Sparkles,
    title: "Hotel-clean, home-comfortable",
    body: "Daily housekeeping and hotel linens meet full kitchens, dining tables, and balconies that catch the breeze.",
  },
  {
    icon: ShieldCheck,
    title: "Book with confidence",
    body: "Transparent pricing, free cancellation up to 7 days out, keycard access, and staff on site around the clock.",
  },
  {
    icon: Heart,
    title: "Filipino hospitality, for real",
    body: "Our small team arranges transfers, island hopping, and celebration surprises — and remembers how you take your coffee.",
  },
  {
    icon: Leaf,
    title: "Kind to the island",
    body: "Refillable water stations, no single-use plastics in the rooms, and cleaning products that don't end up in the reef.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="grain relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink-950">
        <Image
          src="/images/boracay-hero-v2.png"
          alt="White Beach, Boracay — turquoise water meeting powder-white sand"
          fill
          priority
          sizes="100vw"
          className="object-cover saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_30%,rgb(5_15_16/0.2),rgb(5_15_16/0.85))]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-40 sm:px-8 md:pb-28">
          <h1 className="max-w-5xl font-display text-[clamp(3rem,6.4vw,6rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white text-balance">
            A condotel born from too many short vacations
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-32 sm:px-8 md:py-44">
        <div className="space-y-6 text-xl leading-relaxed text-stone-600">
          <p>
            Azure Sands started the way most Boracay stories do: with a trip
            that felt too short. Our family had been coming to the island for
            years — first as backpackers in Station 3 fan rooms, later hauling
            toddlers and coolers to weekend rentals — and every check-out felt
            like leaving mid-sentence.
          </p>
          <p>
            When the chance came to build on a quiet lane near White Beach, we
            knew exactly what was missing on the island: not another hotel
            room you merely sleep in, and not a bare apartment you have to
            fend for yourself in — but something in between.{" "}
            <strong className="font-semibold text-stone-800">
              Suites that live like homes, run like a hotel.
            </strong>
          </p>
          <p>
            So that’s what we built. Every suite at Azure Sands has a kitchen
            or kitchenette, a balcony with real furniture, and space to unpack
            properly. Around them we wrapped the things that make travel easy:
            daily housekeeping, a front desk that answers, airport transfers
            that show up, and a pool for the hours when the beach feels like a
            walk too far.
          </p>
          <p>
            Whether you’re here for a honeymoon weekend, a school-break family
            trip, or a two-month workation chasing fiber Wi-Fi and sunsets —
            we’d love to have you. Come stay a little longer.
          </p>
          <p className="text-xl font-medium text-ink-900">
            — The Azure Sands family
          </p>
        </div>
      </section>

      <section className="border-t border-sand-200">
        <div className="mx-auto max-w-7xl px-5 py-32 sm:px-8 md:py-44">
          <SectionHeading
            title="Why travelers pick Azure Sands"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title} className="p-8">
                <div className="flex size-11 items-center justify-center rounded-xl bg-palm-50">
                  <item.icon className="size-5 text-palm-600" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.body}</p>
              </Card>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-stone-500">
            Questions about the property? Call us at{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-medium text-ocean-700 underline-offset-4 hover:underline"
            >
              {SITE.phone}
            </a>
            .
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
