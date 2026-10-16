import { formatPHP, pluralize } from "@/lib/utils";
import type { PriceQuote } from "@/types";

interface PriceBreakdownProps {
  quote: PriceQuote;
  className?: string;
}

export function PriceBreakdown({ quote, className }: PriceBreakdownProps) {
  return (
    <dl className={className}>
      <div className="flex items-center justify-between py-1.5 text-sm">
        <dt className="text-stone-600">
          {formatPHP(quote.pricePerNight)} × {pluralize(quote.nights, "night")}
        </dt>
        <dd className="font-medium text-stone-800">{formatPHP(quote.subtotal)}</dd>
      </div>
      {quote.longStayDiscount > 0 && (
        <div className="flex items-center justify-between py-1.5 text-sm">
          <dt className="text-palm-700">Long-stay discount (7+ nights, −10%)</dt>
          <dd className="font-medium text-palm-700">
            −{formatPHP(quote.longStayDiscount)}
          </dd>
        </div>
      )}
      {quote.promoDiscount > 0 && (
        <div className="flex items-center justify-between py-1.5 text-sm">
          <dt className="text-palm-700">
            Promo {quote.promoCode ? `· ${quote.promoCode}` : ""}
          </dt>
          <dd className="font-medium text-palm-700">−{formatPHP(quote.promoDiscount)}</dd>
        </div>
      )}
      <div className="flex items-center justify-between py-1.5 text-sm">
        <dt className="text-stone-600">Cleaning fee</dt>
        <dd className="font-medium text-stone-800">{formatPHP(quote.cleaningFee)}</dd>
      </div>
      <div className="flex items-center justify-between py-1.5 text-sm">
        <dt className="text-stone-600">Service fee (5%)</dt>
        <dd className="font-medium text-stone-800">{formatPHP(quote.serviceFee)}</dd>
      </div>
      <div className="flex items-center justify-between py-1.5 text-sm">
        <dt className="text-stone-600">Taxes (12% VAT)</dt>
        <dd className="font-medium text-stone-800">{formatPHP(quote.taxes)}</dd>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-3">
        <dt className="text-[15px] font-semibold text-stone-900">Total</dt>
        <dd className="text-lg font-semibold text-ocean-800">
          {formatPHP(quote.total)}
        </dd>
      </div>
    </dl>
  );
}
