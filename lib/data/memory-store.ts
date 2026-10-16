import { addDays, format, subDays } from "date-fns";
import { computeQuote } from "@/lib/pricing";
import { SAMPLE_ROOMS } from "@/lib/data/rooms";
import { SAMPLE_REVIEWS } from "@/lib/data/reviews";
import { getMenuItem } from "@/lib/data/menu";
import { computeOrderTotal } from "@/lib/food-pricing";
import type {
  BlockedDate,
  Booking,
  FoodOrderWithItems,
  FulfillmentType,
  GymSignup,
  Inquiry,
  PaymentMethod,
  PaymentStatus,
  BookingStatus,
  PromoCode,
  Review,
  Room,
} from "@/types";

/**
 * In-memory demo store used when Supabase env vars are not set. Data persists
 * for the lifetime of the server process (survives HMR via globalThis) so the
 * whole booking flow — including the admin dashboard — works with zero setup.
 * Sample bookings are generated relative to "today" so the demo always shows
 * upcoming check-ins.
 */
export interface MemoryStore {
  rooms: Room[];
  bookings: Booking[];
  blockedDates: BlockedDate[];
  promoCodes: PromoCode[];
  reviews: Review[];
  inquiries: Inquiry[];
  gymSignups: GymSignup[];
  foodOrders: FoodOrderWithItems[];
}

function iso(date: Date) {
  return format(date, "yyyy-MM-dd");
}

interface SampleBookingSpec {
  reference: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  country: string;
  checkIn: Date;
  nights: number;
  guests: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  createdDaysAgo: number;
}

function makeBooking(spec: SampleBookingSpec): Booking {
  const room = SAMPLE_ROOMS.find((r) => r.id === spec.roomId)!;
  const checkIn = iso(spec.checkIn);
  const checkOut = iso(addDays(spec.checkIn, spec.nights));
  const quote = computeQuote({
    pricePerNight: room.price_per_night,
    checkIn,
    checkOut,
  });
  const created = subDays(new Date(), spec.createdDaysAgo).toISOString();
  return {
    id: `demo-${spec.reference}`,
    booking_reference: spec.reference,
    room_id: spec.roomId,
    guest_name: spec.guestName,
    guest_email: spec.guestEmail,
    guest_phone: spec.guestPhone,
    country: spec.country,
    check_in: checkIn,
    check_out: checkOut,
    guest_count: spec.guests,
    special_requests: spec.specialRequests ?? null,
    subtotal: quote.subtotal,
    fees: quote.fees,
    taxes: quote.taxes,
    discount: quote.discount,
    total: quote.total,
    promo_code: null,
    payment_method: spec.paymentMethod,
    payment_status: spec.paymentStatus,
    booking_status: spec.bookingStatus,
    created_at: created,
    updated_at: created,
  };
}

interface SampleOrderSpec {
  reference: string;
  fulfillment: FulfillmentType;
  bookingReference?: string;
  roomNote?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  notes?: string;
  status: FoodOrderWithItems["status"];
  lines: Array<{ itemId: string; qty: number; notes?: string }>;
  minutesAgo: number;
}

function makeFoodOrder(spec: SampleOrderSpec): FoodOrderWithItems {
  const resolved = spec.lines.map((line) => {
    const menuItem = getMenuItem(line.itemId)!;
    return { menuItem, qty: line.qty, notes: line.notes };
  });
  const totals = computeOrderTotal({
    lines: resolved.map((r) => ({ unitPrice: r.menuItem.price, qty: r.qty })),
    fulfillment: spec.fulfillment,
  });
  const created = new Date(Date.now() - spec.minutesAgo * 60_000).toISOString();
  const orderId = `demo-order-${spec.reference}`;
  return {
    id: orderId,
    reference: spec.reference,
    fulfillment_type: spec.fulfillment,
    booking_reference: spec.bookingReference ?? null,
    room_note: spec.roomNote ?? null,
    customer_name: spec.customerName,
    customer_phone: spec.customerPhone,
    customer_email: spec.customerEmail ?? null,
    delivery_address: spec.deliveryAddress ?? null,
    scheduled_for: null,
    notes: spec.notes ?? null,
    subtotal: totals.subtotal,
    fees: totals.fees,
    total: totals.total,
    status: spec.status,
    created_at: created,
    updated_at: created,
    items: resolved.map((r, index) => ({
      id: `${orderId}-line-${index}`,
      order_id: orderId,
      menu_item_id: r.menuItem.id,
      name: r.menuItem.name,
      unit_price: r.menuItem.price,
      qty: r.qty,
      notes: r.notes ?? null,
    })),
  };
}

function createStore(): MemoryStore {
  const today = new Date();
  const year = today.getFullYear();

  const bookings: Booking[] = [
    makeBooking({
      reference: "ASB-DEMO2345",
      roomId: "room-ocean-view-suite",
      guestName: "Isabel Reyes",
      guestEmail: "isabel.reyes@example.com",
      guestPhone: "+63 917 555 0192",
      country: "Philippines",
      checkIn: addDays(today, 3),
      nights: 3,
      guests: 2,
      paymentMethod: "gcash",
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      specialRequests: "Celebrating our anniversary — a late check-out would be lovely if possible.",
      createdDaysAgo: 12,
    }),
    makeBooking({
      reference: "ASB-DEMO6789",
      roomId: "room-deluxe-studio",
      guestName: "Nathan Cole",
      guestEmail: "nathan.cole@example.com",
      guestPhone: "+61 4 5555 0148",
      country: "Australia",
      checkIn: addDays(today, 1),
      nights: 2,
      guests: 1,
      paymentMethod: "pay_later",
      paymentStatus: "pending",
      bookingStatus: "pending",
      createdDaysAgo: 2,
    }),
    makeBooking({
      reference: "ASB-DEMOFAM1",
      roomId: "room-family-suite",
      guestName: "Grace and Miguel Tan",
      guestEmail: "grace.tan@example.com",
      guestPhone: "+65 8555 0133",
      country: "Singapore",
      checkIn: subDays(today, 2),
      nights: 4,
      guests: 4,
      paymentMethod: "card",
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      specialRequests: "One crib for our 18-month-old, please.",
      createdDaysAgo: 20,
    }),
    makeBooking({
      reference: "ASB-DEMOLOFT",
      roomId: "room-premium-loft",
      guestName: "Jonas Weber",
      guestEmail: "jonas.weber@example.com",
      guestPhone: "+49 151 5550 172",
      country: "Germany",
      checkIn: subDays(today, 24),
      nights: 7,
      guests: 4,
      paymentMethod: "bank_transfer",
      paymentStatus: "paid",
      bookingStatus: "completed",
      createdDaysAgo: 45,
    }),
    makeBooking({
      reference: "ASB-DEMOCXL1",
      roomId: "room-ocean-view-suite",
      guestName: "Sophie Laurent",
      guestEmail: "sophie.laurent@example.com",
      guestPhone: "+33 6 55 55 01 84",
      country: "France",
      checkIn: addDays(today, 10),
      nights: 2,
      guests: 2,
      paymentMethod: "maya",
      paymentStatus: "refunded",
      bookingStatus: "cancelled",
      createdDaysAgo: 8,
    }),
  ];

  const blockedDates: BlockedDate[] = [
    {
      id: "blk-demo-1",
      room_id: "room-premium-loft",
      start_date: iso(addDays(today, 10)),
      end_date: iso(addDays(today, 13)),
      reason: "Aircon maintenance",
      created_at: new Date().toISOString(),
    },
  ];

  const promoCodes: PromoCode[] = [
    {
      id: "promo-welcome10",
      code: "WELCOME10",
      discount_type: "percent",
      discount_value: 10,
      valid_from: `${year}-01-01`,
      valid_until: `${year + 1}-12-31`,
      usage_limit: null,
      used_count: 14,
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "promo-island500",
      code: "ISLAND500",
      discount_type: "fixed",
      discount_value: 500,
      valid_from: `${year}-01-01`,
      valid_until: `${year}-12-31`,
      usage_limit: 100,
      used_count: 37,
      active: true,
      created_at: new Date().toISOString(),
    },
  ];

  const inquiries: Inquiry[] = [
    {
      id: "inq-demo-1",
      name: "Olivia Park",
      email: "olivia.park@example.com",
      phone: "+82 10 5555 0126",
      message:
        "Hi! We're a group of 5 arriving via Kalibo in September. Can you arrange airport transfer for all of us, and is the Premium Loft available for 5 nights?",
      status: "new",
      created_at: subDays(new Date(), 1).toISOString(),
    },
    {
      id: "inq-demo-2",
      name: "Marco de la Cruz",
      email: "marco.dlc@example.com",
      phone: null,
      message:
        "Do you offer monthly rates for remote workers? Looking at a 6-8 week stay starting next month.",
      status: "in_progress",
      created_at: subDays(new Date(), 3).toISOString(),
    },
  ];

  const gymSignups: GymSignup[] = [
    {
      id: "demo-gym-1",
      reference: "ASF-DEMO4K7P",
      plan_id: "plan-monthly",
      full_name: "Rico Delgado",
      email: "rico.delgado@example.com",
      phone: "+63 917 555 0111",
      preferred_start: iso(addDays(today, 2)),
      goal: "Back to three sessions a week after a year off. Mostly strength.",
      is_hotel_guest: false,
      status: "new",
      created_at: subDays(new Date(), 1).toISOString(),
      updated_at: subDays(new Date(), 1).toISOString(),
    },
    {
      id: "demo-gym-2",
      reference: "ASF-DEMOJ92X",
      plan_id: "plan-annual",
      full_name: "Aileen Bautista",
      email: "aileen.bautista@example.com",
      phone: "+63 928 555 0174",
      preferred_start: iso(addDays(today, 7)),
      goal: "Zumba twice a week plus whatever Coach Dexter is running.",
      is_hotel_guest: false,
      status: "contacted",
      created_at: subDays(new Date(), 4).toISOString(),
      updated_at: subDays(new Date(), 2).toISOString(),
    },
    {
      id: "demo-gym-3",
      reference: "ASF-DEMOQ38R",
      plan_id: "plan-hotel-guest",
      full_name: "Tom Reyner",
      email: "tom.reyner@example.com",
      phone: "+61 4 5555 0148",
      preferred_start: iso(today),
      goal: "Just need a treadmill while I am on the island for the week.",
      is_hotel_guest: true,
      status: "enrolled",
      created_at: subDays(new Date(), 9).toISOString(),
      updated_at: subDays(new Date(), 8).toISOString(),
    },
    {
      id: "demo-gym-4",
      reference: "ASF-DEMOW6TN",
      plan_id: "plan-student",
      full_name: "Kim Nolasco",
      email: "kim.nolasco@example.com",
      phone: "+63 906 555 0129",
      preferred_start: iso(addDays(today, 1)),
      goal: null,
      is_hotel_guest: false,
      status: "new",
      created_at: subDays(new Date(), 0).toISOString(),
      updated_at: subDays(new Date(), 0).toISOString(),
    },
  ];

  const foodOrders: FoodOrderWithItems[] = [
    makeFoodOrder({
      reference: "ASC-DEMO2P7K",
      fulfillment: "room_delivery",
      bookingReference: "ASB-DEMO2345",
      roomNote: "Please knock, doorbell is broken",
      customerName: "Isabel Reyes",
      customerPhone: "+63 917 555 0192",
      customerEmail: "isabel.reyes@example.com",
      status: "preparing",
      lines: [
        { itemId: "menu-sizzling-sisig", qty: 1, notes: "Extra calamansi" },
        { itemId: "menu-chicken-inasal", qty: 1 },
        { itemId: "menu-mango-shake", qty: 2 },
      ],
      minutesAgo: 12,
    }),
    makeFoodOrder({
      reference: "ASC-DEMOH4XQ",
      fulfillment: "pickup",
      customerName: "Marco de la Cruz",
      customerPhone: "+63 939 555 0166",
      status: "ready",
      lines: [
        { itemId: "menu-chorizo-pizza", qty: 1 },
        { itemId: "menu-buffalo-wings", qty: 1 },
      ],
      minutesAgo: 26,
    }),
    makeFoodOrder({
      reference: "ASC-DEMOB93M",
      fulfillment: "island_delivery",
      customerName: "Grace Tan",
      customerPhone: "+63 920 555 0133",
      deliveryAddress: "Villa Sunrise, D'Mall Road, Station 2, Balabag — blue gate past the pharmacy",
      notes: "Call when you reach the corner.",
      status: "out_for_delivery",
      lines: [
        { itemId: "menu-kare-kare", qty: 1 },
        { itemId: "menu-chicken-adobo", qty: 1 },
        { itemId: "menu-halo-halo", qty: 2 },
      ],
      minutesAgo: 41,
    }),
    makeFoodOrder({
      reference: "ASC-DEMOT51V",
      fulfillment: "room_delivery",
      bookingReference: "ASB-DEMOFAM1",
      roomNote: "Room 304",
      customerName: "Grace and Miguel Tan",
      customerPhone: "+65 8555 0133",
      customerEmail: "grace.tan@example.com",
      status: "completed",
      lines: [
        { itemId: "menu-american-breakfast", qty: 2 },
        { itemId: "menu-barako-coffee", qty: 2 },
        { itemId: "menu-leche-flan", qty: 1 },
      ],
      minutesAgo: 260,
    }),
    makeFoodOrder({
      reference: "ASC-DEMOZ08C",
      fulfillment: "pickup",
      customerName: "Olivia Park",
      customerPhone: "+82 10 5555 0126",
      status: "received",
      lines: [
        { itemId: "menu-tapsilog", qty: 1 },
        { itemId: "menu-calamansi-juice", qty: 1 },
      ],
      minutesAgo: 3,
    }),
  ];

  return {
    rooms: SAMPLE_ROOMS.map((r) => ({ ...r })),
    bookings,
    blockedDates,
    promoCodes,
    reviews: SAMPLE_REVIEWS.map((r) => ({ ...r })),
    inquiries,
    gymSignups,
    foodOrders,
  };
}

/**
 * Bump when the seed data changes shape (e.g. new image paths) so a dev
 * server that is already running reseeds instead of serving stale data.
 */
const STORE_VERSION = 3;

const globalStore = globalThis as unknown as {
  __azureSandsStore?: MemoryStore;
  __azureSandsStoreVersion?: number;
};

export function getMemoryStore(): MemoryStore {
  if (
    !globalStore.__azureSandsStore ||
    globalStore.__azureSandsStoreVersion !== STORE_VERSION
  ) {
    globalStore.__azureSandsStore = createStore();
    globalStore.__azureSandsStoreVersion = STORE_VERSION;
  }
  return globalStore.__azureSandsStore;
}
