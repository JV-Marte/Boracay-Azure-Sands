import { ArrowUpRight, Car, Clock, Laptop, Ship } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { FAQS } from "@/lib/data/faqs";
import { PRICING, SITE } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Bento. grid-flow-dense, interlocking spans:
//   lg (4 cols): A 2x2 + B 2x1 + C 1x1 + D 1x1 + E 4x1 = 12 cells = 3 full rows
//   md (2 cols): A 2x2 + B 2x1 + C 1x1 + D 1x1 + E 2x1 = 10 cells = 5 full rows

export function BentoSection() {
  const longStayPct = Math.round(PRICING.longStayDiscountRate * 100);
  return (
    <section className="mx-auto max-w-7xl px-5 py-32 sm:px-8 md:py-48">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink-900">
          Everything a hotel offers, with room to actually live
        </h2>
        <p className="max-w-sm text-lg leading-relaxed text-stone-500">
          The ease of a hotel and the space of a home, in the best location on the island.
        </p>
      </div>

      <div className="mt-16 grid grid-flow-dense grid-cols-1 gap-3 md:mt-20 md:grid-cols-2 md:auto-rows-[19rem] lg:grid-cols-4 lg:auto-rows-[20rem]">
        {/* A: 2x2 image */}
        <Link
          href="/rooms/premium-loft"
          className="group relative min-h-[26rem] overflow-hidden rounded-[1.75rem] bg-ink-900 md:col-span-2 md:row-span-2 md:min-h-0"
        >
          <Image
            src="/images/rooms/premium-loft/interior.png"
            alt="Premium Loft two-level layout with kitchen, dining table, and staircase"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
            <h3 className="max-w-md text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-4xl">
              Suites that live like homes
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
              Kitchens, dining tables, and real workspaces. Stay a weekend or a
              season without feeling boxed in.
            </p>
          </div>
          <ArrowUpRight
            className="absolute right-6 top-6 size-6 text-white/70 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>

        {/* B: 2x1 view */}
        <Link
          href="/rooms/ocean-view-suite"
          className="group relative min-h-[18rem] overflow-hidden rounded-[1.75rem] bg-ink-900 md:col-span-2 md:min-h-0"
        >
          <Image
            src="/images/rooms/ocean-view-suite/view.png"
            alt="Turquoise sea beyond the palms from the Ocean View Suite balcony"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-ink-950/30 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-xs flex-col justify-end p-7 md:p-9">
            <h3 className="text-2xl font-medium leading-[1.08] tracking-[-0.03em] text-white md:text-3xl">
              Steps from White Beach
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/75">
              On the sand before your coffee cools.
            </p>
          </div>
        </Link>

        {/* C: 1x1 typographic */}
        <div className="flex min-h-[16rem] flex-col justify-between rounded-[1.75rem] bg-sand-100 p-7 md:min-h-0">
          <Laptop className="size-7 text-ink-900" strokeWidth={1.5} aria-hidden />
          <div>
            <h3 className="text-2xl font-medium leading-[1.08] tracking-[-0.03em] text-ink-900">
              Fiber Wi-Fi and a proper desk
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-stone-500">
              Built for workations that outlast the tan.
            </p>
          </div>
        </div>

        {/* D: 1x1 lagoon number */}
        <div className="flex min-h-[16rem] flex-col justify-between rounded-[1.75rem] bg-ocean-300 p-7 text-ink-950 md:min-h-0">
          <p className="text-[clamp(4rem,7vw,6rem)] font-bold leading-[0.85] tracking-[-0.06em]">
            {longStayPct}%
          </p>
          <div>
            <h3 className="text-2xl font-medium leading-[1.08] tracking-[-0.03em] text-ink-950">
              Off stays of a week or more
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-950/70">
              Applied automatically, no code needed.
            </p>
          </div>
        </div>

        {/* E: full-width hospitality band */}
        <div className="grain ambient-lagoon relative flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] md:col-span-2 md:min-h-0 md:flex-row lg:col-span-4">
          <div className="relative z-10 flex flex-1 flex-col justify-between gap-8 p-7 md:p-9">
            <h3 className="max-w-lg text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-4xl">
              Hospitality that remembers how you take your coffee
            </h3>
            <ul className="grid gap-4 text-[15px] text-white/75 sm:grid-cols-3">
              <li className="flex items-center gap-3">
                <Car className="size-5 shrink-0 text-ocean-300" strokeWidth={1.5} aria-hidden />
                Caticlan transfers arranged
              </li>
              <li className="flex items-center gap-3">
                <Ship className="size-5 shrink-0 text-ocean-300" strokeWidth={1.5} aria-hidden />
                Island hopping booked for you
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-5 shrink-0 text-ocean-300" strokeWidth={1.5} aria-hidden />
                Front desk 7 AM to 10 PM
              </li>
            </ul>
          </div>
          <div className="group relative hidden w-[38%] overflow-hidden lg:block">
            <Image
              src="/images/rooms/ocean-view-suite/balcony.png"
              alt="Ocean-facing private balcony of the Ocean View Suite"
              fill
              sizes="30vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function FaqSection() {
  const items = FAQS.slice(0, 5).map((f) => ({ question: f.question, answer: f.answer }));
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-32 sm:px-8 md:py-48 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-4">
        <h2 className="text-[clamp(2.5rem,4.6vw,4rem)] font-medium leading-[1] tracking-[-0.045em] text-ink-900">
          Before you pack
        </h2>
        <p className="mt-6 max-w-sm text-lg leading-relaxed text-stone-500">
          The things guests usually ask. Anything else, the{" "}
          <Link href="/faq" className="text-ink-900 underline decoration-ocean-400 underline-offset-4 hover:text-ocean-700">
            full FAQ
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-ink-900 underline decoration-ocean-400 underline-offset-4 hover:text-ocean-700">
            a human
          </Link>{" "}
          can answer.
        </p>
      </div>
      <Accordion items={items} className="lg:col-span-7 lg:col-start-6" />
    </section>
  );
}

// ---------------------------------------------------------------------------

export function CtaSection() {
  return (
    <section className="grain relative isolate overflow-hidden bg-ink-950">
      <Image
        src="/images/about-exterior-v2.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-60 saturate-[0.7]"
        aria-hidden
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgb(5_15_16/0.45),rgb(5_15_16/0.92))]"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-36 text-center sm:px-8 md:py-56">
        <h2 className="mx-auto max-w-6xl text-[clamp(3rem,7.5vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white">
          The sunset is better from your own balcony
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70">
          Pick your dates and lock in your suite. Free cancellation up to 7 days
          before check-in.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/booking" variant="sunset" size="lg">
            Book your stay
            <ArrowUpRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href={`tel:${SITE.phone.replace(/\s/g, "")}`} variant="glass" size="lg">
            Call the front desk
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
