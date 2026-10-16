"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  addLine,
  clearCart,
  getServerSnapshot,
  getSnapshot,
  removeLine,
  setLineNotes,
  setLineQty,
  subscribe,
} from "@/components/cafe/cart-store";
import { getMenuItem } from "@/lib/data/menu";
import { computeOrderTotal } from "@/lib/food-pricing";
import type { CartLine, FulfillmentType, MenuItem, OrderTotals } from "@/types";

export interface ResolvedLine {
  item: MenuItem;
  qty: number;
  notes?: string;
  lineTotal: number;
}

export interface CartValue {
  lines: CartLine[];
  resolved: ResolvedLine[];
  count: number;
  subtotal: number;
  /** Client-side preview only — the server recomputes at checkout. */
  totalsFor: (fulfillment: FulfillmentType) => OrderTotals;
  add: typeof addLine;
  setQty: typeof setLineQty;
  setNotes: typeof setLineNotes;
  remove: typeof removeLine;
  clear: typeof clearCart;
  /** False during SSR and the first paint, so markup matches on hydration. */
  hydrated: boolean;
}

/**
 * The cart itself lives in components/cafe/cart-store.ts. This is only the
 * read hook — there is no context provider to mount, so any client component
 * under /cafe can call it directly.
 */
export function useCart(): CartValue {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const resolved = useMemo<ResolvedLine[]>(
    () =>
      lines.flatMap((line) => {
        const item = getMenuItem(line.itemId);
        if (!item) return [];
        return [{ item, qty: line.qty, notes: line.notes, lineTotal: item.price * line.qty }];
      }),
    [lines],
  );

  return useMemo(() => {
    const count = resolved.reduce((n, l) => n + l.qty, 0);
    const subtotal = resolved.reduce((n, l) => n + l.lineTotal, 0);
    return {
      lines,
      resolved,
      count,
      subtotal,
      totalsFor: (fulfillment: FulfillmentType) =>
        computeOrderTotal({
          lines: resolved.map((l) => ({ unitPrice: l.item.price, qty: l.qty })),
          fulfillment,
        }),
      add: addLine,
      setQty: setLineQty,
      setNotes: setLineNotes,
      remove: removeLine,
      clear: clearCart,
      hydrated,
    };
  }, [lines, resolved, hydrated]);
}
