import Link from "next/link";
import { StatCard } from "@/components/admin/AdminTable";
import { OrderBoard } from "@/components/admin/OrderBoard";
import { isKitchenOpen } from "@/lib/food-pricing";
import { listFoodOrders } from "@/services/food-orders";
import { formatPHP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const all = await listFoodOrders();
  const live = all.filter((o) =>
    ["received", "preparing", "ready", "out_for_delivery"].includes(o.status),
  );

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const today = all.filter(
    (o) => new Date(o.created_at) >= startOfDay && o.status !== "cancelled",
  );
  const revenueToday = today.reduce((sum, o) => sum + o.total, 0);
  const roomCharges = today.filter((o) => o.fulfillment_type === "room_delivery").length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-900">Kitchen board</h1>
          <p className="mt-1 text-sm text-stone-500">
            Live tickets from{" "}
            <Link href="/cafe/menu" className="text-ocean-700 hover:underline">
              Azure Sands Cafe
            </Link>
            . This page refreshes itself every 30 seconds.
          </p>
        </div>
        <span
          className={
            isKitchenOpen()
              ? "rounded-full bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700"
              : "rounded-full bg-stone-100 px-3.5 py-2 text-sm font-medium text-stone-500"
          }
        >
          {isKitchenOpen() ? "Kitchen open" : "Kitchen closed"}
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Live tickets" value={String(live.length)} />
        <StatCard label="Orders today" value={String(today.length)} />
        <StatCard label="Revenue today" value={formatPHP(revenueToday)} />
        <StatCard
          label="Charged to rooms"
          value={String(roomCharges)}
          hint="Billed to a stay today"
        />
      </div>

      <div className="mt-8">
        <OrderBoard orders={live} />
      </div>

      <p className="mt-8 text-xs text-stone-400">
        Showing live tickets only. {all.length - live.length} completed or cancelled orders are
        kept on record.
      </p>
    </div>
  );
}
