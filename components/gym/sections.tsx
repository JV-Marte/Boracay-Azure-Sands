import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrubReveal } from "@/components/motion/ScrubReveal";
import { TypeMarquee } from "@/components/motion/TypeMarquee";
import {
  DAY_NAMES,
  GYM_CLASSES,
  GYM_FACILITIES,
  GYM_PLANS,
  GYM_TESTIMONIALS,
  getTrainer,
} from "@/lib/data/gym";
import { GYM } from "@/lib/constants";
import { cn, formatPHP } from "@/lib/utils";
import type { GymClass } from "@/types";
import type { Zone } from "./ZoneAccordion";

const CHAPTER = "mx-auto max-w-7xl px-5 py-32 sm:px-8 md:py-48";

/** Big left-aligned chapter title with an optional aside on the right. */
function ChapterHead({ title, aside }: { title: string; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <h2 className="max-w-4xl text-[clamp(2.5rem,5.2vw,4.75rem)] font-black leading-[0.95] tracking-[-0.05em] text-white">
        {title}
      </h2>
      {aside && <div className="max-w-sm text-lg leading-relaxed text-white/55">{aside}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------

export function GymMarquee() {
  const disciplines = [...new Set(GYM_CLASSES.map((c) => c.name))];
  return (
    <TypeMarquee
      items={disciplines}
      label="Classes at Azure Sands Fitness"
      className="border-y border-white/10 py-9 md:py-12"
      textClassName="text-[clamp(2.25rem,5.5vw,4.75rem)] font-black leading-none tracking-[-0.045em]"
      solidClassName="text-white"
      outlineClassName="text-transparent [-webkit-text-stroke:1.5px_var(--color-ember-500)]"
      dotClassName="bg-ember-500"
    />
  );
}

// ---------------------------------------------------------------------------
// Bento. grid-flow-dense, interlocking spans:
//   lg (4 cols): A 2x2 + B 2x1 + C 1x1 + D 1x1 + E 4x1 = 12 cells = 3 full rows
//   md (2 cols): A 2x2 + B 2x1 + C 1x1 + D 1x1 + E 2x1 = 10 cells = 5 full rows

export function GymBento() {
  const guest = GYM_PLANS.find((p) => p.slug === "hotel-guest");
  const zones = GYM_FACILITIES.filter((f) =>
    ["free_weights", "cardio_deck", "functional_turf", "group_studio"].includes(f.key),
  );
  return (
    <section className={CHAPTER} id="facilities">
      <ChapterHead
        title="Everything you need, nothing you don't"
        aside="One floor, four zones, and enough equipment that you never queue for a rack at 6 AM."
      />

      <div className="mt-16 grid grid-flow-dense grid-cols-1 gap-3 md:mt-20 md:grid-cols-2 md:auto-rows-[18rem] lg:grid-cols-4 lg:auto-rows-[19rem]">
        {/* A: 2x2 image */}
        <div className="group relative min-h-[24rem] overflow-hidden rounded-xl bg-iron-900 md:col-span-2 md:row-span-2 md:min-h-0">
          <Image
            src="/images/gym/reception.jpg"
            alt="The reception desk at Azure Sands Fitness"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-iron-950 via-iron-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
            <h3 className="max-w-md text-3xl font-black leading-[1] tracking-[-0.04em] text-white md:text-4xl">
              Air-conditioned, 5 AM to 11 PM
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              Train before the heat or after the sunset. The floor stays cool either way.
            </p>
          </div>
        </div>

        {/* B: 2x1 ember coaching */}
        <div className="flex min-h-[16rem] flex-col justify-between rounded-xl bg-ember-500 p-7 text-iron-950 md:col-span-2 md:min-h-0 md:p-9">
          <p className="text-sm font-bold">Every membership</p>
          <div>
            <h3 className="max-w-md text-3xl font-black leading-[1] tracking-[-0.04em] text-iron-950 md:text-4xl">
              Starts with a free session with a coach
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-iron-950/75">
              Nobody gets left to figure out the cable machine alone.
            </p>
          </div>
        </div>

        {/* C: 1x1 image */}
        <div className="group relative min-h-[16rem] overflow-hidden rounded-xl bg-iron-900 md:min-h-0">
          <Image
            src="/images/gym/locker-room.jpg"
            alt="Showers and day lockers"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-iron-950/90 to-transparent" />
          <h3 className="absolute inset-x-0 bottom-0 p-7 text-2xl font-black leading-[1.05] tracking-[-0.03em] text-white">
            Hot showers, lockers, a fresh towel
          </h3>
        </div>

        {/* D: 1x1 guest rate */}
        <div className="flex min-h-[16rem] flex-col justify-between rounded-xl border border-white/10 bg-iron-900 p-7 md:min-h-0">
          <p className="text-[clamp(3.25rem,5.5vw,4.5rem)] font-black leading-[0.85] tracking-[-0.06em] text-white">
            {guest ? formatPHP(guest.price) : "₱150"}
          </p>
          <div>
            <h3 className="text-2xl font-black leading-[1.05] tracking-[-0.03em] text-white">
              A day, if you’re staying upstairs
            </h3>
            <p className="mt-2 text-[15px] text-white/55">Show your room key at the desk.</p>
          </div>
        </div>

        {/* E: full-width zone strip */}
        <div className="grain relative flex min-h-[18rem] flex-col justify-center overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(70%_120%_at_0%_0%,rgb(248_71_26/0.16),transparent_60%)] bg-iron-900 p-7 md:col-span-2 md:min-h-0 md:p-9 lg:col-span-4">
          <ul className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {zones.map((zone) => (
              <li key={zone.key}>
                <zone.icon className="size-7 text-ember-400" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-5 text-xl font-bold tracking-[-0.02em] text-white">{zone.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{zone.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function GymManifesto() {
  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-8 md:py-48">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/10 blur-[140px]"
      />
      <div className="relative z-10">
        <ScrubReveal
          text="Most hotel gyms are a treadmill and a mirror. This one has two squat racks, a sled track, a studio that gets loud, and three coaches who will fix your deadlift before your coffee goes cold."
          accent={["loud", "deadlift"]}
          className="mx-auto max-w-6xl text-[clamp(1.875rem,4.2vw,3.75rem)] font-bold leading-[1.1] tracking-[-0.04em] text-white"
          accentClassName="text-ember-400"
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export const ZONES: Zone[] = [
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

// ---------------------------------------------------------------------------

export function ClassRow({ session }: { session: GymClass }) {
  const trainer = getTrainer(session.trainer_id);
  const intensityTone =
    session.intensity === "high"
      ? "bg-ember-500/15 text-ember-300"
      : session.intensity === "moderate"
        ? "bg-amber-400/15 text-amber-300"
        : "bg-emerald-400/15 text-emerald-300";
  return (
    <div className="group flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/10 py-6 transition-colors hover:border-ember-500/60">
      <span className="w-20 shrink-0 text-2xl font-black tracking-[-0.03em] text-white tabular-nums">
        {session.start_time}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold text-white transition-colors group-hover:text-ember-300">
          {session.name}
        </p>
        <p className="truncate text-sm text-white/50">
          {trainer?.name} · {session.duration_min} min · {session.capacity} spots
        </p>
      </div>
      <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize", intensityTone)}>
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
    <section className={CHAPTER}>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 className="text-[clamp(2.5rem,5.2vw,4.75rem)] font-black leading-[0.95] tracking-[-0.05em] text-white">
            {isToday ? "On the floor today" : `Next up, ${DAY_NAMES[dayIndex]}`}
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/55">
            Every class is included with every membership. Day-pass holders can drop into anything
            running during their visit.
          </p>
          <Link
            href="/gym/schedule"
            className="group mt-9 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-lg font-medium text-white transition-colors hover:border-ember-400 hover:text-ember-300"
          >
            Full weekly schedule
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
        <div className="border-t border-white/10 lg:col-span-7">
          {sessions.map((session) => (
            <ClassRow key={session.id} session={session} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function GymMemberQuotes() {
  return (
    <ul className="mt-24 grid gap-10 border-t border-white/10 pt-12 md:grid-cols-3 md:gap-8">
      {GYM_TESTIMONIALS.map((t) => (
        <li key={t.name}>
          <blockquote className="text-lg leading-relaxed text-white/80">“{t.quote}”</blockquote>
          <p className="mt-5 font-bold text-white">{t.name}</p>
          <p className="text-sm text-white/45">{t.detail}</p>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------

export function GymFaq({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <section className={cn(CHAPTER, "grid gap-12 lg:grid-cols-12 lg:gap-10")} id="faq">
      <h2 className="text-[clamp(2.5rem,4.6vw,4rem)] font-black leading-[0.95] tracking-[-0.05em] text-white lg:col-span-4">
        Before you come in
      </h2>
      <div className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7 lg:col-start-6">
        {faqs.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-bold text-white transition-colors hover:text-ember-300 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <Plus
                className="size-5 shrink-0 text-white/50 transition-transform duration-300 group-open:rotate-45 group-open:text-ember-400"
                aria-hidden
              />
            </summary>
            <p className="max-w-2xl pb-7 text-base leading-relaxed text-white/60">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function GymCta() {
  return (
    <section className="grain relative isolate overflow-hidden bg-iron-950">
      <Image
        src="/images/gym/functional-turf.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-40 grayscale"
        aria-hidden
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_50%,rgb(18_22_25/0.4),rgb(18_22_25/0.95))]"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/2 h-72 w-[56rem] -translate-x-1/2 rounded-full bg-ember-500/30 blur-[120px]"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-36 text-center sm:px-8 md:py-56">
        <h2 className="mx-auto max-w-6xl text-[clamp(3.25rem,8.5vw,8.5rem)] font-black leading-[0.88] tracking-[-0.06em] text-white">
          First session is <span className="text-ember-400">on us</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70">
          Sign up online and a coach meets you at the desk, walks you through every machine, and
          writes your first four-week programme. Walk-ins welcome too.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/gym/join"
            className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-ember-500 px-8 text-base font-bold text-iron-950 transition-colors duration-300 hover:bg-ember-400"
          >
            Start a membership
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
          <a
            href={`tel:${GYM.phone.replace(/\s/g, "")}`}
            className="inline-flex h-14 items-center rounded-full border border-white/25 px-8 text-base font-medium text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
          >
            Call {GYM.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
