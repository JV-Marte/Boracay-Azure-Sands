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
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8 md:pb-32 md:pt-16">
      <h1 className="text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-espresso-900 text-balance">
        Almost there
      </h1>
      <div className="mt-10">
        <CheckoutForm kitchenOpen={isKitchenOpen()} />
      </div>
    </div>
  );
}
