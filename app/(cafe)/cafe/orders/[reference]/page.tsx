import { BedDouble, Bike, MapPin, Phone, Store } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusTimeline } from "@/components/cafe/OrderStatusTimeline";
import { CAFE } from "@/lib/constants";
import { getMenuItem } from "@/lib/data/menu";
import { estimatePrepMinutes } from "@/lib/food-pricing";
import { findFoodOrder } from "@/services/food-orders";
import { formatPHP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

const MODE_COPY = {
  room_delivery: {
    icon: BedDouble,
    label: "Delivering to your room",
    note: "Charged to your stay — settle it at check-out.",
  },
  pickup: {
    icon: Store,
    label: "Pick up at the cafe counter",
    note: "Show this reference at the lobby-level counter.",
  },
  island_delivery: {
    icon: Bike,
    label: "Delivering on the island",
    note: "Pay the rider in cash on arrival.",
  },
} as const;

export default async function CafeOrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await findFoodOrder(reference);
  if (!order) notFound();

  const mode = MODE_COPY[order.fulfillment_type];
  const eta = estimatePrepMinutes(
    order.items.map((i) => getMenuItem(i.menu_item_id)?.prep_minutes ?? 15),
    order.fulfillment_type,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sunset-600">
              Order {order.reference}
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] text-ink-900">
              Thanks, {order.customer_name.split(" ")[0]} — we&apos;re on it
            </h1>
          </div>
          {order.status !== "completed" && order.status !== "cancelled" && (
            <span className="rounded-full bg-sunset-50 px-3.5 py-2 text-sm font-semibold text-sunset-700">
              ~{eta} min
            </span>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-sand-50 px-4 py-3.5">
          <mode.icon className="mt-0.5 size-5 shrink-0 text-sunset-600" aria-hidden />
          <div>
            <p className="font-medium text-stone-900">{mode.label}</p>
            <p className="mt-0.5 text-sm text-stone-600">{mode.note}</p>
            {order.booking_reference && (
              <p className="mt-1 text-sm text-stone-500">
                Billed to booking{" "}
                <span className="font-mono text-stone-700">{order.booking_reference}</span>
                {order.room_note && ` · ${order.room_note}`}
              </p>
            )}
            {order.delivery_address && (
              <p className="mt-1 text-sm text-stone-500">{order.delivery_address}</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <OrderStatusTimeline
            status={order.status}
            fulfillment={order.fulfillment_type}
          />
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6">
          <h2 className="font-display text-lg font-medium text-ink-900">What you ordered</h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 text-sm">
                <span className="text-stone-700">
                  <span className="font-medium tabular-nums text-stone-900">{item.qty}×</span>{" "}
                  {item.name}
                  {item.notes && (
                    <span className="mt-0.5 block text-xs text-stone-500">{item.notes}</span>
                  )}
                </span>
                <span className="shrink-0 tabular-nums text-stone-700">
                  {formatPHP(item.unit_price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          {order.notes && (
            <p className="mt-4 rounded-xl bg-sand-50 px-4 py-3 text-sm leading-relaxed text-stone-600">
              <span className="font-medium text-stone-800">Note for the kitchen:</span>{" "}
              {order.notes}
            </p>
          )}

          <dl className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between text-stone-600">
              <dt>Subtotal (VAT included)</dt>
              <dd className="tabular-nums">{formatPHP(order.subtotal)}</dd>
            </div>
            {order.fees > 0 && (
              <div className="flex justify-between text-stone-600">
                <dt>
                  {order.fulfillment_type === "room_delivery"
                    ? "Room service (10%)"
                    : "Island delivery"}
                </dt>
                <dd className="tabular-nums">{formatPHP(order.fees)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-stone-200 pt-3 font-display text-lg font-medium text-ink-900">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPHP(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stone-200 pt-6 text-sm text-stone-500">
          <span className="flex items-center gap-2">
            <Phone className="size-4 text-sunset-500" aria-hidden />
            <a href={`tel:${CAFE.phone.replace(/\s/g, "")}`} className="hover:text-stone-900">
              {CAFE.phone}
            </a>
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-sunset-500" aria-hidden />
            Ground floor, Azure Sands Boracay
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/cafe/menu"
          className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          Order something else
        </Link>
        <Link
          href="/cafe/track"
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-medium text-stone-700 transition-colors hover:bg-sand-50"
        >
          Track another order
        </Link>
      </div>
    </div>
  );
}
