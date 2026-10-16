export type RoomType = "studio" | "suite" | "loft";
export type RoomStatus = "active" | "inactive";
export type BedType =
  | "queen"
  | "king"
  | "two_queens"
  | "king_and_queen";

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  room_type: RoomType;
  price_per_night: number;
  max_guests: number;
  bed_type: BedType;
  bed_summary: string;
  room_size: number; // square meters
  amenities: string[]; // amenity keys, see lib/data/amenities.ts
  images: string[]; // public paths, e.g. /images/rooms/deluxe-studio/interior.png
  status: RoomStatus;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type PaymentMethod =
  | "pay_later"
  | "card"
  | "gcash"
  | "maya"
  | "bank_transfer";

export interface Booking {
  id: string;
  booking_reference: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  country: string;
  check_in: string; // yyyy-MM-dd
  check_out: string; // yyyy-MM-dd
  guest_count: number;
  special_requests: string | null;
  subtotal: number;
  fees: number;
  taxes: number;
  discount: number;
  total: number;
  promo_code: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface BlockedDate {
  id: string;
  room_id: string;
  start_date: string; // inclusive, yyyy-MM-dd
  end_date: string; // exclusive, yyyy-MM-dd
  reason: string | null;
  created_at: string;
}

export type DiscountType = "percent" | "fixed";

export interface PromoCode {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  valid_from: string; // yyyy-MM-dd
  valid_until: string; // yyyy-MM-dd
  usage_limit: number | null;
  used_count: number;
  active: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  guest_name: string;
  rating: number; // 1..5
  comment: string;
  stay_type: string | null; // e.g. "Family stay", "Couple"
  approved: boolean;
  created_at: string;
}

export type InquiryStatus = "new" | "in_progress" | "resolved";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

/** A half-open date range [start, end) in yyyy-MM-dd. */
export interface DateRange {
  start: string;
  end: string;
}

export interface PriceQuote {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  fees: number; // cleaningFee + serviceFee
  taxes: number;
  discount: number;
  longStayDiscount: number;
  promoDiscount: number;
  promoCode: string | null;
  total: number;
}

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  upcomingCheckIns: Booking[];
  upcomingCheckOuts: Booking[];
  revenueThisMonth: number;
  revenueTotal: number;
  occupancyRate: number; // 0..100 over next 30 days
  recentBookings: Booking[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: "rooms" | "views" | "bathrooms" | "dining" | "fitness";
}

export interface Attraction {
  name: string;
  description: string;
  distance: string; // editable placeholder, e.g. "~5 min walk*"
  image: string;
}

export interface Faq {
  question: string;
  answer: string;
  category: string;
}

export * from "./gym";
export * from "./food";
