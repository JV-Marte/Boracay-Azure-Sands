/** Azure Sands Cafe domain types. */

export type MenuTag = "bestseller" | "spicy" | "vegetarian" | "chef-pick";

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  category: string; // key into MENU_CATEGORIES
  description: string;
  price: number; // whole PHP, VAT-inclusive
  image: string; // public path
  tags: MenuTag[];
  prep_minutes: number;
  available: boolean;
}

/** A line in the client-side cart. Prices are never trusted from the client. */
export interface CartLine {
  itemId: string;
  qty: number;
  notes?: string;
}

export type FulfillmentType = "room_delivery" | "pickup" | "island_delivery";

export type FoodOrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export interface FoodOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  /** Denormalised so historical orders survive menu edits. */
  name: string;
  unit_price: number;
  qty: number;
  notes: string | null;
}

export interface FoodOrder {
  id: string;
  reference: string;
  fulfillment_type: FulfillmentType;
  /** Set for room deliveries — the stay the order is billed to. */
  booking_reference: string | null;
  room_note: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string | null;
  /** ISO timestamp for a requested pickup slot. */
  scheduled_for: string | null;
  notes: string | null;
  subtotal: number;
  fees: number;
  total: number;
  status: FoodOrderStatus;
  created_at: string;
  updated_at: string;
}

export interface FoodOrderWithItems extends FoodOrder {
  items: FoodOrderItem[];
}

export interface OrderTotals {
  subtotal: number;
  roomServiceCharge: number;
  deliveryFee: number;
  fees: number; // roomServiceCharge + deliveryFee
  total: number;
}
