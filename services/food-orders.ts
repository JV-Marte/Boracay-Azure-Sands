import { randomUUID } from "crypto";
import { generateReference, normalizeReference } from "@/lib/booking-reference";
import { CAFE, CAFE_PRICING, CAFE_REFERENCE_PREFIX } from "@/lib/constants";
import { getMenuItem } from "@/lib/data/menu";
import { getMemoryStore } from "@/lib/data/memory-store";
import { computeOrderTotal, deliveryMinimumShortfall, isKitchenOpen } from "@/lib/food-pricing";
import {
  isMissingTableError,
  isTableKnownMissing,
  markTableMissing,
} from "@/lib/supabase/module-tables";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { findBooking } from "@/services/bookings";
import { ServiceError } from "@/services/errors";
import { formatPHP } from "@/lib/utils";
import type {
  FoodOrder,
  FoodOrderItem,
  FoodOrderStatus,
  FoodOrderWithItems,
  MenuItem,
} from "@/types";
import type { FoodOrderRequest } from "@/lib/validation/schemas";

const ORDERS = "food_orders";
const ITEMS = "food_order_items";

function dbReady() {
  return (
    isSupabaseConfigured() && !isTableKnownMissing(ORDERS) && !isTableKnownMissing(ITEMS)
  );
}

/**
 * Re-resolve every cart line against the live menu. The client sends item ids
 * and quantities only — prices and names always come from the server, so a
 * tampered cart cannot change what an order costs.
 */
function resolveLines(lines: FoodOrderRequest["lines"]) {
  const resolved: Array<{ item: MenuItem; qty: number; notes: string | null }> = [];
  for (const line of lines) {
    const item = getMenuItem(line.itemId);
    if (!item) {
      throw new ServiceError(
        "One of the items in your cart is no longer on the menu. Please review your order.",
        400,
      );
    }
    if (!item.available) {
      throw new ServiceError(`${item.name} has just sold out. Please remove it and try again.`, 409);
    }
    const existing = resolved.find((r) => r.item.id === item.id && r.notes === (line.notes || null));
    if (existing) {
      existing.qty = Math.min(existing.qty + line.qty, CAFE_PRICING.maxLineQty);
    } else {
      resolved.push({ item, qty: line.qty, notes: line.notes?.trim() ? line.notes.trim() : null });
    }
  }
  if (!resolved.length) throw new ServiceError("Your cart is empty.", 400);
  return resolved;
}

export async function createFoodOrder(request: FoodOrderRequest): Promise<FoodOrderWithItems> {
  if (!isKitchenOpen()) {
    throw new ServiceError(
      `The kitchen is closed right now. ${CAFE.name} takes orders from 6:00 AM to 10:00 PM.`,
      409,
    );
  }

  const resolved = resolveLines(request.lines);
  const totals = computeOrderTotal({
    lines: resolved.map((r) => ({ unitPrice: r.item.price, qty: r.qty })),
    fulfillment: request.fulfillmentType,
  });

  const shortfall = deliveryMinimumShortfall(totals.subtotal, request.fulfillmentType);
  if (shortfall !== null) {
    throw new ServiceError(
      `Delivery in Kalibo starts at ${formatPHP(CAFE_PRICING.deliveryMinimum)}. Add ${formatPHP(shortfall)} more, or switch to pickup.`,
      400,
    );
  }

  // Mode-specific fields. Room deliveries are billed to a real stay, so the
  // booking must exist and still be active before we accept the order.
  let bookingReference: string | null = null;
  let roomNote: string | null = null;
  let customerName: string;
  let customerPhone: string;
  let customerEmail: string | null = null;
  let deliveryAddress: string | null = null;
  let scheduledFor: string | null = null;

  if (request.fulfillmentType === "room_delivery") {
    const { booking } = await findBooking(request.bookingReference, request.email);
    if (booking.booking_status === "cancelled") {
      throw new ServiceError("That booking has been cancelled, so we can't charge it.", 409);
    }
    if (booking.booking_status === "completed") {
      throw new ServiceError(
        "That stay has already checked out. Choose pickup or delivery instead.",
        409,
      );
    }
    bookingReference = booking.booking_reference;
    roomNote = request.roomNote?.trim() ? request.roomNote.trim() : null;
    customerName = booking.guest_name;
    customerPhone = booking.guest_phone;
    customerEmail = booking.guest_email;
  } else {
    customerName = request.customerName;
    customerPhone = request.customerPhone;
    if (request.fulfillmentType === "island_delivery") {
      deliveryAddress = request.landmark?.trim()
        ? `${request.deliveryAddress} (${request.landmark.trim()})`
        : request.deliveryAddress;
    } else if (request.pickupTime) {
      const [hours, minutes] = request.pickupTime.split(":").map(Number);
      const when = new Date();
      when.setHours(hours, minutes, 0, 0);
      // A time earlier than now means they mean tomorrow.
      if (when.getTime() < Date.now()) when.setDate(when.getDate() + 1);
      scheduledFor = when.toISOString();
    }
  }

  const now = new Date().toISOString();
  const orderId = randomUUID();
  const order: FoodOrder = {
    id: orderId,
    reference: generateReference(CAFE_REFERENCE_PREFIX),
    fulfillment_type: request.fulfillmentType,
    booking_reference: bookingReference,
    room_note: roomNote,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
    delivery_address: deliveryAddress,
    scheduled_for: scheduledFor,
    notes: request.notes?.trim() ? request.notes.trim() : null,
    subtotal: totals.subtotal,
    fees: totals.fees,
    total: totals.total,
    status: "received",
    created_at: now,
    updated_at: now,
  };

  const items: FoodOrderItem[] = resolved.map((r) => ({
    id: randomUUID(),
    order_id: orderId,
    menu_item_id: r.item.id,
    name: r.item.name,
    unit_price: r.item.price,
    qty: r.qty,
    notes: r.notes,
  }));

  if (dbReady()) {
    const supabase = getSupabase();
    const { error: orderError } = await supabase.from(ORDERS).insert(order);
    if (isMissingTableError(orderError)) {
      markTableMissing(ORDERS);
    } else if (orderError) {
      throw new ServiceError("Could not place your order. Please try again.", 500);
    } else {
      const { error: itemsError } = await supabase.from(ITEMS).insert(items);
      if (itemsError) {
        // Never leave a headless order in the kitchen queue.
        await supabase.from(ORDERS).delete().eq("id", orderId);
        if (isMissingTableError(itemsError)) {
          markTableMissing(ITEMS);
        } else {
          throw new ServiceError("Could not place your order. Please try again.", 500);
        }
      } else {
        return { ...order, items };
      }
    }
  }

  getMemoryStore().foodOrders.unshift({ ...order, items });
  return { ...order, items };
}

export async function findFoodOrder(
  reference: string,
  phone?: string,
): Promise<FoodOrderWithItems | null> {
  const ref = normalizeReference(reference);

  if (dbReady()) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from(ORDERS)
      .select("*")
      .eq("reference", ref)
      .maybeSingle();
    if (isMissingTableError(error)) {
      markTableMissing(ORDERS);
    } else if (error) {
      throw new ServiceError("Could not look up that order.", 500);
    } else {
      const order = data as FoodOrder | null;
      if (!order) return null;
      if (phone && !phoneMatches(order.customer_phone, phone)) return null;
      const { data: itemRows } = await supabase.from(ITEMS).select("*").eq("order_id", order.id);
      return { ...order, items: (itemRows as FoodOrderItem[]) ?? [] };
    }
  }

  const match = getMemoryStore().foodOrders.find((o) => o.reference === ref);
  if (!match) return null;
  if (phone && !phoneMatches(match.customer_phone, phone)) return null;
  return match;
}

/** Compare on digits only — people type spaces, dashes, and +63 vs 0 freely. */
function phoneMatches(stored: string, provided: string) {
  const digits = (v: string) => v.replace(/\D/g, "");
  const a = digits(stored);
  const b = digits(provided);
  if (!a || !b) return false;
  return a.endsWith(b.slice(-9)) || b.endsWith(a.slice(-9));
}

export interface FoodOrderFilters {
  status?: FoodOrderStatus;
  /** Exclude finished orders — the default view for the kitchen board. */
  activeOnly?: boolean;
}

const ACTIVE_STATUSES: FoodOrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "out_for_delivery",
];

export async function listFoodOrders(
  filters?: FoodOrderFilters,
): Promise<FoodOrderWithItems[]> {
  if (dbReady()) {
    const supabase = getSupabase();
    let query = supabase.from(ORDERS).select("*").order("created_at", { ascending: false });
    if (filters?.status) query = query.eq("status", filters.status);
    else if (filters?.activeOnly) query = query.in("status", ACTIVE_STATUSES);
    const { data, error } = await query;
    if (isMissingTableError(error)) {
      markTableMissing(ORDERS);
    } else if (error) {
      throw new ServiceError("Could not load orders.", 500);
    } else {
      const orders = (data as FoodOrder[]) ?? [];
      if (!orders.length) return [];
      const { data: itemRows } = await supabase
        .from(ITEMS)
        .select("*")
        .in("order_id", orders.map((o) => o.id));
      const byOrder = new Map<string, FoodOrderItem[]>();
      for (const row of ((itemRows as FoodOrderItem[]) ?? [])) {
        const list = byOrder.get(row.order_id) ?? [];
        list.push(row);
        byOrder.set(row.order_id, list);
      }
      return orders.map((o) => ({ ...o, items: byOrder.get(o.id) ?? [] }));
    }
  }

  const all = getMemoryStore().foodOrders;
  const filtered = filters?.status
    ? all.filter((o) => o.status === filters.status)
    : filters?.activeOnly
      ? all.filter((o) => ACTIVE_STATUSES.includes(o.status))
      : all;
  return [...filtered].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateFoodOrderStatus(
  id: string,
  status: FoodOrderStatus,
): Promise<void> {
  if (dbReady()) {
    const { error } = await getSupabase()
      .from(ORDERS)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (isMissingTableError(error)) {
      markTableMissing(ORDERS);
    } else if (error) {
      throw new ServiceError("Could not update that order.", 500);
    } else {
      return;
    }
  }

  const order = getMemoryStore().foodOrders.find((o) => o.id === id);
  if (!order) throw new ServiceError("Order not found.", 404);
  order.status = status;
  order.updated_at = new Date().toISOString();
}
