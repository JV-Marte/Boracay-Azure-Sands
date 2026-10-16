import type { Metadata } from "next";
import { ManageBooking } from "@/components/booking/ManageBooking";

export const metadata: Metadata = {
  title: "Manage booking",
  description:
    "View, modify, or cancel your Azure Sands Boracay booking using your reference number and email address.",
  robots: { index: false },
};

export default function ManageBookingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ocean-600">
        Manage booking
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        Your booking, your rules
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-500">
        Check your details, update guest information, or cancel — no account,
        no phone queue.
      </p>
      <div className="mt-10">
        <ManageBooking />
      </div>
    </div>
  );
}
