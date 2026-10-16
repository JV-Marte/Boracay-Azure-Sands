import { ArrowRight, Check, Clock, MapPin, Quote, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DAY_NAMES,
  GYM_CLASSES,
  GYM_FACILITIES,
  GYM_PLANS,
  GYM_TESTIMONIALS,
  GYM_TRAINERS,
  getTrainer,
} from "@/lib/data/gym";
import { GYM } from "@/lib/constants";
import { cn, formatPHP } from "@/lib/utils";
import type { GymClass } from "@/types";

const SECTION = "mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8";

export function GymSectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow && (
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ember-400">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] text-white text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3.5 text-base leading-relaxed text-white/60 sm:text-lg">{description}</p>
      )}
    </div>
  );
}

export function GymHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/gym/hero.jpg"
        alt="The main training floor at Azure Sands Fitness"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-iron-950 via-iron-950/85 to-iron-950/30" />
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl font-medium tracking-[-0.03em] text-white text-balance sm:text-6xl">
            {GYM.tagline}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            A full-equipment gym on the ground floor of Azure Sands Boracay. Free weights, a
            cardio deck, functional turf, and coached classes six days a week — open to the
            island, not just to our guests.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/gym/join"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ember-500 px-7 text-base font-semibold text-white transition-colors hover:bg-ember-600"
            >
              Start a membership
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/gym/schedule"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-7 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              See the class schedule
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[
              { label: "Day pass", value: "₱250" },
              { label: "Open daily", value: "5 AM – 11 PM" },
              { label: "Classes / week", value: `${GYM_CLASSES.length}` },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/45">{stat.label}</dt>
                <dd className="mt-1 font-display text-xl font-medium text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function GymFacilities() {
  const featured = GYM_FACILITIES.filter((f) => f.featured);
  return (
    <section className={SECTION} id="facilities">
      <GymSectionHeading
        eyebrow="What's inside"
        title="Everything you need, nothing you don't"
        description="One floor, four zones, and enough equipment that you never queue for a rack at 6 AM."
      />
      <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((facility) => (
          <div key={facility.key}>
            <span className="grid size-11 place-items-center rounded-xl bg-white/5 ring-1 ring-inset ring-white/10">
              <facility.icon className="size-5 text-ember-400" aria-hidden />
            </span>
            <h3 className="mt-4 font-medium text-white">{facility.label}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">{facility.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const ZONES = [
  {
    image: "/images/gym/strength-zone.jpg",
    title: "The strength floor",
    body: "Two squat racks, an olympic bench, dumbbells to 50 kg, and a full set of bumper plates against a mirrored wall. Chalk is allowed.",
  },
  {
    image: "/images/gym/cardio-deck.jpg",
    title: "The cardio deck",
    body: "Treadmills, bikes, and rowers lined up along the windows. Better than a hotel treadmill room, by a distance.",
  },
  {
    image: "/images/gym/functional-turf.jpg",
    title: "The turf zone",
    body: "Sled track, kettlebells, battle ropes, and a rig for pull-ups and TRX. Where most of the group classes end up.",
  },
  {
    image: "/images/gym/group-studio.jpg",
    title: "The studio",
    body: "Mirrored, air-conditioned, and loud when it needs to be. Yoga at 7 PM, Zumba at 6:30, HIIT at dawn.",
  },
];

export function GymZones() {
  return (
    <section className="border-y border-white/10 bg-iron-900/40">
      <div className={SECTION}>
        <GymSectionHeading
          eyebrow="The floor"
          title="Four zones under one roof"
          align="left"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {ZONES.map((zone) => (
            <article
              key={zone.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-iron-900"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={zone.image}
                  alt={zone.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-medium text-white">{zone.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{zone.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GymPlans() {
  return (
    <section className={SECTION} id="plans">
      <GymSectionHeading
        eyebrow="Membership"
        title="Pick a plan, start this week"
        description="No joining fee, no lock-in beyond the term you pay for. Every membership includes all group classes."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {GYM_PLANS.map((plan) => (
          <article
            key={plan.id}
            className={cn(
              "flex flex-col rounded-2xl border p-7",
              plan.featured
                ? "border-ember-500/50 bg-gradient-to-b from-ember-500/10 to-transparent ring-1 ring-ember-500/20"
                : "border-white/10 bg-iron-900/60",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-medium text-white">{plan.name}</h3>
              {plan.badge && (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                    plan.featured
                      ? "bg-ember-500 text-white"
                      : "bg-white/10 text-white/70",
                  )}
                >
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-medium text-white">
                {formatPHP(plan.price)}
              </span>
              <span className="text-sm text-white/50">
                {plan.billing_period === "visit" ? "per visit" : `/ ${plan.billing_period}`}
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{plan.description}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex gap-2.5 text-sm text-white/75">
                  <Check className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/gym/join?plan=${plan.slug}`}
              className={cn(
                "mt-7 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                plan.featured
                  ? "bg-ember-500 text-white hover:bg-ember-600"
                  : "border border-white/20 text-white hover:bg-white/10",
              )}
            >
              Choose {plan.name}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function GymTrainers() {
  return (
    <section className="border-y border-white/10 bg-iron-900/40" id="trainers">
      <div className={SECTION}>
        <GymSectionHeading
          eyebrow="The coaches"
          title="Three people who will learn your name"
          description="Every membership starts with a free onboarding session. Nobody gets left to figure out the cable machine alone."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {GYM_TRAINERS.map((trainer) => (
            <article key={trainer.id}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 font-display text-xl font-medium text-white">{trainer.name}</h3>
              <p className="mt-1 text-sm font-medium text-ember-400">{trainer.specialty}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{trainer.bio}</p>
              <p className="mt-3 text-xs text-white/40">{trainer.certification}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClassRow({ session }: { session: GymClass }) {
  const trainer = getTrainer(session.trainer_id);
  const intensityTone =
    session.intensity === "high"
      ? "bg-ember-500/15 text-ember-300"
      : session.intensity === "moderate"
        ? "bg-amber-400/15 text-amber-300"
        : "bg-emerald-400/15 text-emerald-300";
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-white/10 bg-iron-900/60 px-4 py-3.5">
      <span className="w-16 shrink-0 font-display text-lg font-medium text-white tabular-nums">
        {session.start_time}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-white">{session.name}</p>
        <p className="truncate text-sm text-white/50">
          {trainer?.name} · {session.duration_min} min · {session.capacity} spots
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
          intensityTone,
        )}
      >
        {session.intensity}
      </span>
    </div>
  );
}

export function GymSchedulePreview() {
  // Show the next day that actually has classes, starting from today.
  const todayIndex = new Date().getDay();
  let dayIndex = todayIndex;
  let sessions: GymClass[] = [];
  for (let i = 0; i < 7; i++) {
    dayIndex = (todayIndex + i) % 7;
    sessions = GYM_CLASSES.filter((c) => c.day === dayIndex).sort((a, b) =>
      a.start_time.localeCompare(b.start_time),
    );
    if (sessions.length) break;
  }
  const isToday = dayIndex === todayIndex;

  return (
    <section className={SECTION}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <GymSectionHeading
          eyebrow="Classes"
          title={isToday ? "On the timetable today" : `Next up: ${DAY_NAMES[dayIndex]}`}
          description="All classes are included with every membership, and day-pass holders can drop into anything running during their visit."
          align="left"
        />
        <Link
          href="/gym/schedule"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ember-400 hover:text-ember-300"
        >
          Full weekly schedule
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {sessions.map((session) => (
          <ClassRow key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}

export function GymTestimonials() {
  return (
    <section className="border-y border-white/10 bg-iron-900/40">
      <div className={SECTION}>
        <GymSectionHeading eyebrow="Members" title="What people say on the floor" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {GYM_TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-iron-900 p-7"
            >
              <Quote className="size-6 text-ember-500/60" aria-hidden />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-white/80">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-4">
                <p className="font-medium text-white">{t.name}</p>
                <p className="text-sm text-white/45">{t.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-center gap-1.5 text-sm text-white/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 fill-ember-400 text-ember-400" aria-hidden />
          ))}
          <span className="ml-2">Rated 4.8 by members and hotel guests</span>
        </div>
      </div>
    </section>
  );
}

export function GymCta() {
  return (
    <section className={SECTION}>
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-ember-600 to-ember-800 px-8 py-14 sm:px-14">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-medium tracking-[-0.03em] text-white text-balance sm:text-4xl">
            First session is on us
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            Sign up online and a coach will meet you at the desk, walk you through every machine,
            and write your first four-week programme. Walk-ins welcome too — ₱250 a day, ₱150 if
            you are staying upstairs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/gym/join"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-ember-700 transition-colors hover:bg-white/90"
            >
              Start a membership
            </Link>
            <a
              href={`tel:${GYM.phone.replace(/\s/g, "")}`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-7 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              Call {GYM.phone}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden />
              {GYM.address}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4" aria-hidden />
              {GYM.hoursLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GymFaq({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <section className={SECTION} id="faq">
      <GymSectionHeading eyebrow="Questions" title="Before you come in" />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-iron-900/60">
        {faqs.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-white transition-colors hover:bg-white/5">
              {faq.question}
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/20 text-white/60 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-[15px] leading-relaxed text-white/60">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
