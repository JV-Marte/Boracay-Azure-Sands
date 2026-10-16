import type { Metadata } from "next";
import Link from "next/link";
import { ClassRow } from "@/components/gym/sections";
import { GYM } from "@/lib/constants";
import { DAY_NAMES, GYM_CLASSES, GYM_TRAINERS } from "@/lib/data/gym";

export const metadata: Metadata = {
  title: "Class schedule",
  description: `The weekly group-class timetable at ${GYM.name} on Boracay — HIIT, Zumba, yoga, spin, strength, and Muay Thai conditioning. All classes included with every membership.`,
};

export default function GymSchedulePage() {
  const today = new Date().getDay();
  // Monday-first ordering, which is how a gym timetable is read.
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-12 sm:px-8 md:pb-32 md:pt-16">
      <h1 className="text-[clamp(2.75rem,6vw,5.5rem)] font-black leading-[0.92] tracking-[-0.055em] text-white text-balance">
        Weekly class schedule
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
        {GYM_CLASSES.length} coached sessions a week, all included with a membership. Day-pass
        holders can join anything running during their visit at no extra charge — just tell the
        front desk when you check in.
      </p>

      <div className="mt-12 space-y-10">
        {dayOrder.map((day) => {
          const sessions = GYM_CLASSES.filter((c) => c.day === day).sort((a, b) =>
            a.start_time.localeCompare(b.start_time),
          );
          return (
            <section key={day}>
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl font-medium text-white">
                  {DAY_NAMES[day]}
                </h2>
                {day === today && (
                  <span className="rounded-full bg-ember-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ember-300">
                    Today
                  </span>
                )}
              </div>
              {sessions.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {sessions.map((session) => (
                    <ClassRow key={session.id} session={session} />
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-white/45">
                  No group classes — the floor is open as usual, {GYM.hoursLabel.toLowerCase()}.
                </p>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl border border-white/10 bg-iron-900/60 p-7">
        <h2 className="font-display text-xl font-medium text-white">Who is teaching</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {GYM_TRAINERS.map((trainer) => (
            <li key={trainer.id}>
              <p className="font-medium text-white">{trainer.name}</p>
              <p className="text-sm text-ember-400">{trainer.specialty}</p>
            </li>
          ))}
        </ul>
        <Link
          href="/gym/join"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-ember-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-ember-600"
        >
          Join and get every class included
        </Link>
      </div>
    </div>
  );
}
