import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cafe/CheckoutForm";
import { isKitchenOpen } from "@/lib/food-pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and choose room delivery, counter pickup, or island delivery.",
  robots: { index: false, follow: false },
};

export default function CafeCheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sunset-600">
        Checkout
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] text-ink-900">
        Almost there
      </h1>
      <div className="mt-10">
        <CheckoutForm kitchenOpen={isKitchenOpen()} />
      </div>
    </div>
  );
}
