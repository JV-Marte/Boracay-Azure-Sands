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
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-8 md:pb-32">
      <h1 className="font-display text-[clamp(2.75rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink-900 text-balance">
        Your booking, your rules
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-500">
        Check your details, update guest information, or cancel — no account,
        no phone queue.
      </p>
      <div className="mt-10">
        <ManageBooking />
      </div>
    </div>
  );
}
