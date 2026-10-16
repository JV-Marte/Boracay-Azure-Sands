import { CAFE_PRICING } from "@/lib/constants";
import type { CartLine } from "@/types";

/**
 * The cart lives in localStorage rather than React state so it survives a
 * reload and a hard navigation between /cafe/menu and /cafe/checkout. It is
 * exposed as an external store (subscribe / getSnapshot) so components can
 * read it with useSyncExternalStore — no hydration effects, and the server
 * snapshot is always an empty cart.
 */
const STORAGE_KEY = "rsc_cart_v1";

const EMPTY: CartLine[] = [];

let snapshot: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function sanitize(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return EMPTY;
  const lines = value
    .filter(
      (l): l is CartLine =>
        typeof l?.itemId === "string" && Number.isFinite((l as CartLine)?.qty),
    )
    .map((l) => ({
      itemId: l.itemId,
      qty: Math.min(Math.max(Math.trunc(l.qty), 1), CAFE_PRICING.maxLineQty),
      notes: typeof l.notes === "string" ? l.notes : undefined,
    }))
    .slice(0, CAFE_PRICING.maxLines);
  return lines.length ? lines : EMPTY;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    snapshot = raw ? sanitize(JSON.parse(raw)) : EMPTY;
  } catch {
    snapshot = EMPTY;
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Private browsing or a full quota — the cart just won't survive a reload.
  }
}

function commit(next: CartLine[]) {
  snapshot = next.length ? next : EMPTY;
  persist();
  listeners.forEach((fn) => fn());
}

export function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  // Keep two open tabs in agreement.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      snapshot = e.newValue ? sanitize(JSON.parse(e.newValue)) : EMPTY;
    } catch {
      snapshot = EMPTY;
    }
    listeners.forEach((fn) => fn());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): CartLine[] {
  load();
  return snapshot;
}

export function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function addLine(itemId: string, qty = 1) {
  const current = getSnapshot();
  const existing = current.find((l) => l.itemId === itemId);
  if (existing) {
    commit(
      current.map((l) =>
        l.itemId === itemId
          ? { ...l, qty: Math.min(l.qty + qty, CAFE_PRICING.maxLineQty) }
          : l,
      ),
    );
    return;
  }
  if (current.length >= CAFE_PRICING.maxLines) return;
  commit([...current, { itemId, qty: Math.min(qty, CAFE_PRICING.maxLineQty) }]);
}

export function setLineQty(itemId: string, qty: number) {
  const current = getSnapshot();
  commit(
    qty <= 0
      ? current.filter((l) => l.itemId !== itemId)
      : current.map((l) =>
          l.itemId === itemId
            ? { ...l, qty: Math.min(Math.trunc(qty), CAFE_PRICING.maxLineQty) }
            : l,
        ),
  );
}

export function setLineNotes(itemId: string, notes: string) {
  commit(
    getSnapshot().map((l) =>
      l.itemId === itemId ? { ...l, notes: notes.slice(0, 200) } : l,
    ),
  );
}

export function removeLine(itemId: string) {
  commit(getSnapshot().filter((l) => l.itemId !== itemId));
}

export function clearCart() {
  commit([]);
}
