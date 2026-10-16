import { Check, Clock, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { JoinForm } from "@/components/gym/JoinForm";
import { GYM } from "@/lib/constants";
import { GYM_PLANS } from "@/lib/data/gym";

export const metadata: Metadata = {
  title: "Join",
  description: `Start a membership at ${GYM.name} on Boracay. Day passes from ₱250, monthly from ₱1,500, all group classes included.`,
};

const DEFAULT_PLAN_ID = "plan-monthly";

export default async function GymJoinPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planSlug } = await searchParams;
  const matched = planSlug ? GYM_PLANS.find((p) => p.slug === planSlug) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ember-400">
          Membership
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] text-white sm:text-5xl">
          Start training this week
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/60">
          Fill this in and a coach calls you within one business day to confirm your start date.
          Nothing is charged online — you settle at the front desk on your first visit.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
          <JoinForm defaultPlanId={matched?.id ?? DEFAULT_PLAN_ID} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-iron-900/60 p-6">
            <h2 className="font-display text-lg font-medium text-white">
              What every membership includes
            </h2>
            <ul className="mt-4 space-y-2.5">
              {[
                "Unlimited access, 5 AM to 11 PM",
                "Every group class on the timetable",
                "A free onboarding session with a coach",
                "Towel, day locker, and hot showers",
                "Free parking on Rizal Street",
              ].map((perk) => (
                <li key={perk} className="flex gap-2.5 text-sm text-white/70">
                  <Check className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-iron-900/60 p-6">
            <h2 className="font-display text-lg font-medium text-white">Prefer to walk in?</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Day passes are ₱250 at the desk, ₱150 if you are staying at the condotel. No
              sign-up needed — just bring shoes.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                {GYM.address}
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                {GYM.hoursLabel}
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                <a href={`tel:${GYM.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {GYM.phone}
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
