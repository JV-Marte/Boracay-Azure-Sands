import { Clock } from "lucide-react";
import type { Metadata } from "next";
import { MenuBrowser } from "@/components/cafe/MenuBrowser";
import { CAFE } from "@/lib/constants";
import { MENU_ITEMS } from "@/lib/data/menu";
import { isKitchenOpen } from "@/lib/food-pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description: `${MENU_ITEMS.length} dishes and drinks from ${CAFE.name} on Boracay — all-day breakfast, Filipino favourites, sizzling plates, pizza, and desserts. Order for pickup, delivery, or straight to your room.`,
};

export default function CafeMenuPage() {
  const open = isKitchenOpen();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sunset-600">
        Menu
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] text-ink-900 sm:text-5xl">
        What&apos;s cooking today
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-500">
        Everything is cooked to order. Prices include VAT — the only thing added at checkout is a
        delivery fee or the room-service charge, depending on how you want it.
      </p>

      {!open && (
        <div
          role="status"
          className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
        >
          <Clock className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
          <div>
            <p className="font-medium text-amber-900">The kitchen is closed right now</p>
            <p className="mt-0.5 text-sm text-amber-800">
              {CAFE.hoursLabel}. Have a browse — you can order as soon as we open.
            </p>
          </div>
        </div>
      )}

      <MenuBrowser kitchenOpen={open} />
    </div>
  );
}
