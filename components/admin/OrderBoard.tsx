"use client";

import { BedDouble, Bike, ChefHat, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatPHP } from "@/lib/utils";
import type { FoodOrderStatus, FoodOrderWithItems, FulfillmentType } from "@/types";

/** A one-minute clock, read through useSyncExternalStore so render stays pure. */
let tickNow = 0;
const tickListeners = new Set<() => void>();

function subscribeToTick(listener: () => void) {
  if (!tickNow) tickNow = Date.now();
  tickListeners.add(listener);
  const id = setInterval(() => {
    tickNow = Date.now();
    tickListeners.forEach((fn) => fn());
  }, 60_000);
  return () => {
    tickListeners.delete(listener);
    clearInterval(id);
  };
}

const COLUMNS: Array<{ status: FoodOrderStatus; label: string; hint: string }> = [
  { status: "received", label: "New", hint: "Fire these" },
  { status: "preparing", label: "Cooking", hint: "On the pass" },
  { status: "ready", label: "Ready", hint: "Plated and packed" },
  { status: "out_for_delivery", label: "Out", hint: "With a runner" },
];

const MODE_META: Record<FulfillmentType, { icon: typeof BedDouble; label: string; tone: "ocean" | "sand" | "sunset" }> = {
  room_delivery: { icon: BedDouble, label: "To room", tone: "ocean" },
  pickup: { icon: Store, label: "Pickup", tone: "sand" },
  island_delivery: { icon: Bike, label: "Delivery", tone: "sunset" },
};

/** The status the kitchen would move this order to next. */
function nextStatus(order: FoodOrderWithItems): FoodOrderStatus | null {
  switch (order.status) {
    case "received":
      return "preparing";
    case "preparing":
      return "ready";
    case "ready":
      return order.fulfillment_type === "pickup" ? "completed" : "out_for_delivery";
    case "out_for_delivery":
      return "completed";
    default:
      return null;
  }
}

const NEXT_LABEL: Record<FoodOrderStatus, string> = {
  received: "Start cooking",
  preparing: "Mark ready",
  ready: "Hand over",
  out_for_delivery: "Mark delivered",
  completed: "Done",
  cancelled: "Cancelled",
};

function minutesAgo(iso: string, now: number) {
  const mins = Math.max(Math.round((now - new Date(iso).getTime()) / 60_000), 0);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

function OrderCard({
  order,
  onAdvance,
  onCancel,
  busy,
  now,
}: {
  order: FoodOrderWithItems;
  onAdvance: (order: FoodOrderWithItems) => void;
  onCancel: (order: FoodOrderWithItems) => void;
  busy: boolean;
  /** Passed in rather than read during render, so the card stays pure. */
  now: number;
}) {
  const mode = MODE_META[order.fulfillment_type];
  const next = nextStatus(order);
  const stale = now - new Date(order.created_at).getTime() > 30 * 60_000;

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-stone-500">{order.reference}</p>
          <p className="mt-0.5 font-medium text-stone-900">{order.customer_name}</p>
        </div>
        <Badge tone={mode.tone}>
          <mode.icon className="size-3" aria-hidden />
          {mode.label}
        </Badge>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-stone-700">
        {order.items.map((item) => (
          <li key={item.id}>
            <span className="font-semibold tabular-nums">{item.qty}×</span> {item.name}
            {item.notes && <span className="block text-xs text-sunset-700">↳ {item.notes}</span>}
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
          {order.notes}
        </p>
      )}

      {order.booking_reference && (
        <p className="mt-3 text-xs text-stone-500">
          Bill to <span className="font-mono text-stone-700">{order.booking_reference}</span>
          {order.room_note && ` · ${order.room_note}`}
        </p>
      )}
      {order.delivery_address && (
        <p className="mt-3 text-xs leading-relaxed text-stone-500">{order.delivery_address}</p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
        <span className={stale ? "text-xs font-medium text-red-600" : "text-xs text-stone-400"}>
          {minutesAgo(order.created_at, now)}
        </span>
        <span className="text-sm font-semibold tabular-nums text-stone-900">
          {formatPHP(order.total)}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        {next && (
          <Button
            size="sm"
            loading={busy}
            onClick={() => onAdvance(order)}
            className="flex-1 bg-stone-900 hover:bg-stone-800"
          >
            {NEXT_LABEL[order.status]}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onCancel(order)}>
          Cancel
        </Button>
      </div>
    </article>
  );
}

export function OrderBoard({ orders }: { orders: FoodOrderWithItems[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  // The kitchen leaves this page open, so pull fresh tickets in the background
  // and re-stamp "now" on the same beat to keep the ticket ages honest.
  const now = useSyncExternalStore(subscribeToTick, () => tickNow, () => 0);
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 30_000);
    return () => clearInterval(id);
  }, [router]);

  const setStatus = async (order: FoodOrderWithItems, status: FoodOrderStatus) => {
    setBusyId(order.id);
    try {
      const res = await fetch(`/api/admin/food-orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Could not update the order.");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const advance = (order: FoodOrderWithItems) => {
    const next = nextStatus(order);
    if (next) void setStatus(order, next);
  };

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ChefHat}
        title="No live orders"
        description="Orders placed at /cafe/checkout appear here the moment they come in."
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {COLUMNS.map((column) => {
        const columnOrders = orders.filter((o) => o.status === column.status);
        return (
          <section key={column.status} className="rounded-2xl bg-sand-50/70 p-3">
            <header className="flex items-baseline justify-between px-1 pb-3">
              <h2 className="text-sm font-semibold text-stone-800">
                {column.label}
                <span className="ml-1.5 tabular-nums text-stone-400">
                  {columnOrders.length}
                </span>
              </h2>
              <p className="text-[11px] uppercase tracking-wide text-stone-400">{column.hint}</p>
            </header>
            <div className="space-y-3">
              {columnOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  busy={busyId === order.id}
                  now={now}
                  onAdvance={advance}
                  onCancel={(o) => setStatus(o, "cancelled")}
                />
              ))}
              {columnOrders.length === 0 && (
                <p className="rounded-xl border border-dashed border-stone-300 px-3 py-6 text-center text-xs text-stone-400">
                  Nothing here
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
