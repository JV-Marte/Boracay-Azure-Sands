import { CAFE, CAFE_PRICING } from "@/lib/constants";
import type { FulfillmentType, OrderTotals } from "@/types";

export interface PricedLine {
  unitPrice: number;
  qty: number;
}

/**
 * Compute an order total. Menu prices are VAT-inclusive, so there is no
 * separate tax line — only the fees each fulfillment mode carries:
 *
 *  - room_delivery   → a 10% room-service charge, billed to the stay
 *  - pickup          → nothing
 *  - island_delivery → a flat rider fee
 *
 * All amounts are whole pesos, matching computeQuote() in lib/pricing.ts.
 */
export function computeOrderTotal(options: {
  lines: PricedLine[];
  fulfillment: FulfillmentType;
}): OrderTotals {
  const { lines, fulfillment } = options;
  const subtotal = lines.reduce(
    (sum, line) => sum + Math.round(line.unitPrice) * Math.max(line.qty, 0),
    0,
  );

  const roomServiceCharge =
    fulfillment === "room_delivery"
      ? Math.round(subtotal * CAFE_PRICING.roomServiceRate)
      : 0;
  const deliveryFee =
    fulfillment === "island_delivery" && subtotal > 0 ? CAFE_PRICING.deliveryFee : 0;
  const fees = roomServiceCharge + deliveryFee;

  return { subtotal, roomServiceCharge, deliveryFee, fees, total: subtotal + fees };
}

/** Kalibo delivery has a minimum basket; returns null when the order is fine. */
export function deliveryMinimumShortfall(
  subtotal: number,
  fulfillment: FulfillmentType,
): number | null {
  if (fulfillment !== "island_delivery") return null;
  const shortfall = CAFE_PRICING.deliveryMinimum - subtotal;
  return shortfall > 0 ? shortfall : null;
}

/**
 * Is the kitchen taking orders right now? Evaluated in Philippine time
 * (GMT+8) so the answer is the same wherever the server happens to run.
 */
export function isKitchenOpen(at: Date = new Date()): boolean {
  const hour = manilaHour(at);
  return hour >= CAFE.openHour && hour < CAFE.closeHour;
}

export function manilaHour(at: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    hour12: false,
  }).formatToParts(at);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  return hour === 24 ? 0 : hour;
}

/** Rough "ready in" estimate shown on the confirmation page. */
export function estimatePrepMinutes(
  prepMinutes: number[],
  fulfillment: FulfillmentType,
): number {
  const longest = prepMinutes.length ? Math.max(...prepMinutes) : 15;
  const base = longest + Math.max(prepMinutes.length - 1, 0) * 2;
  const travel = fulfillment === "island_delivery" ? 20 : fulfillment === "room_delivery" ? 8 : 0;
  return Math.min(base + travel, 90);
}
