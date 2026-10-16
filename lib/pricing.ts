import { differenceInCalendarDays, parseISO } from "date-fns";
import { PRICING } from "@/lib/constants";
import type { PriceQuote, PromoCode } from "@/types";

/** The subset of a promo code needed to price a stay (safe to send client-side). */
export type PromoLike = Pick<PromoCode, "code" | "discount_type" | "discount_value">;

export function nightsBetween(checkIn: string, checkOut: string) {
  return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
}

/**
 * Compute the full price breakdown for a stay. All amounts are rounded to
 * whole pesos. The long-stay discount (7+ nights) and a promo code can stack;
 * both apply against the room subtotal.
 */
export function computeQuote(options: {
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  promo?: PromoLike | null;
}): PriceQuote {
  const { pricePerNight, checkIn, checkOut, promo } = options;
  const nights = Math.max(nightsBetween(checkIn, checkOut), 0);
  const subtotal = Math.round(pricePerNight * nights);

  const longStayDiscount =
    nights >= PRICING.longStayMinNights
      ? Math.round(subtotal * PRICING.longStayDiscountRate)
      : 0;

  let promoDiscount = 0;
  if (promo) {
    promoDiscount =
      promo.discount_type === "percent"
        ? Math.round(subtotal * (promo.discount_value / 100))
        : Math.round(promo.discount_value);
  }

  // Never discount below zero
  const discount = Math.min(longStayDiscount + promoDiscount, subtotal);

  const cleaningFee = nights > 0 ? PRICING.cleaningFee : 0;
  const serviceFee = Math.round(subtotal * PRICING.serviceFeeRate);
  const fees = cleaningFee + serviceFee;
  const taxes = Math.round((subtotal - discount + fees) * PRICING.taxRate);
  const total = subtotal - discount + fees + taxes;

  return {
    nights,
    pricePerNight,
    subtotal,
    cleaningFee,
    serviceFee,
    fees,
    taxes,
    discount,
    longStayDiscount,
    promoDiscount,
    promoCode: promo?.code ?? null,
    total,
  };
}
