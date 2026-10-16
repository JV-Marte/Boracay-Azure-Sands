import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/cafe/TrackOrderForm";
import { CAFE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Track an order",
  description: `Check where your ${CAFE.name} order is with your reference and mobile number.`,
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sunset-600">
        Track
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] text-ink-900">
        Where&apos;s my order?
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-500">
        Enter the reference from your confirmation and the mobile number on the order.
      </p>
      <div className="mt-10 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card sm:p-8">
        <TrackOrderForm />
      </div>
      <p className="mt-6 text-sm text-stone-500">
        Lost the reference? Call the cafe on{" "}
        <a
          href={`tel:${CAFE.phone.replace(/\s/g, "")}`}
          className="font-medium text-sunset-700 hover:underline"
        >
          {CAFE.phone}
        </a>{" "}
        and we&apos;ll find it.
      </p>
    </div>
  );
}
