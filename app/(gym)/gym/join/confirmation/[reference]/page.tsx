import { CircleCheck, Clock, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GYM } from "@/lib/constants";
import { getGymPlan } from "@/lib/data/gym";
import { findGymSignup } from "@/services/gym";
import { formatDateLong, formatPHP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign-up confirmed",
  robots: { index: false, follow: false },
};

const PERIOD_LABEL: Record<string, string> = {
  visit: "per visit",
  day: "per day",
  month: "per month",
  quarter: "per quarter",
  year: "per year",
};

export default async function GymSignupConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const signup = await findGymSignup(reference);
  if (!signup) notFound();

  const plan = getGymPlan(signup.plan_id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-full bg-ember-500/15 ring-1 ring-inset ring-ember-500/30">
          <CircleCheck className="size-7 text-ember-400" aria-hidden />
        </span>
        <h1 className="mt-6 font-display text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
          You&apos;re on the list, {signup.full_name.split(" ")[0]}
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/60">
          A coach will call {signup.phone} within one business day to confirm your start date.
          Bring this reference to the front desk on your first visit.
        </p>
        <p className="mt-6 rounded-xl border border-white/15 bg-iron-900 px-6 py-3 font-mono text-xl tracking-wider text-white">
          {signup.reference}
        </p>
      </div>

      <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
        {[
          { label: "Membership", value: plan?.name ?? signup.plan_id },
          {
            label: "Rate",
            value: plan
              ? `${formatPHP(plan.price)} ${PERIOD_LABEL[plan.billing_period] ?? ""}`
              : "—",
          },
          { label: "Preferred start", value: formatDateLong(signup.preferred_start) },
          { label: "Email", value: signup.email },
          { label: "Mobile", value: signup.phone },
          {
            label: "Hotel guest",
            value: signup.is_hotel_guest ? "Yes — resident rate applies" : "No",
          },
        ].map((row) => (
          <div key={row.label} className="bg-iron-900 px-5 py-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-white/40">{row.label}</dt>
            <dd className="mt-1 text-[15px] text-white">{row.value}</dd>
          </div>
        ))}
      </dl>

      {signup.goal && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-iron-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-white/40">Your goal</p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/80">{signup.goal}</p>
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-white/10 bg-iron-900/60 p-6">
        <h2 className="font-display text-lg font-medium text-white">Finding us</h2>
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

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/gym/schedule"
          className="inline-flex h-11 items-center justify-center rounded-full bg-ember-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-ember-600"
        >
          Plan your first week
        </Link>
        <Link
          href="/gym"
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Back to the gym
        </Link>
      </div>
    </div>
  );
}
