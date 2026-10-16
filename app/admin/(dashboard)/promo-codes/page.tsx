import { PromoManager } from "@/components/admin/PromoManager";
import { listPromoCodes } from "@/services/promos";

export const dynamic = "force-dynamic";

export default async function PromoCodesPage() {
  const promos = await listPromoCodes();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-medium text-ink-900">Promo codes</h1>
      <p className="mt-1 text-sm text-stone-500">
        Discounts guests can apply at checkout. They stack with the automatic
        long-stay discount.
      </p>
      <div className="mt-8">
        <PromoManager promos={promos} />
      </div>
    </div>
  );
}
