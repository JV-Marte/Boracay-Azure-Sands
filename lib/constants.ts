/**
 * `??` only falls back on null/undefined, but a var declared with no value in
 * a .env file arrives as "". Treat blank as unset so the defaults below apply.
 *
 * The process.env references stay written out in full: Next inlines
 * NEXT_PUBLIC_* at build time by matching the literal text, so a dynamic
 * process.env[name] lookup would not be replaced in the client bundle.
 */
function orDefault(value: string | undefined, fallback: string) {
  return value && value.trim() ? value : fallback;
}

export const SITE = {
  name: "Azure Sands Boracay Condotel",
  shortName: "Azure Sands",
  tagline: "Your Island Stay in the Heart of Boracay",
  description:
    "Azure Sands is a boutique condotel steps from White Beach, Boracay — spacious island suites with kitchenettes, a pool, and warm Filipino hospitality for couples, families, and long-stay guests.",
  url: orDefault(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  // Contact placeholders — replace with real details before launch
  phone: "+63 900 000 0000",
  email: "stay@azuresandsboracay.example",
  whatsapp: "+639000000000",
  address: "Station 2, White Beach Path, Balabag, Boracay Island, Malay, Aklan 5608, Philippines",
  checkInTime: "2:00 PM",
  checkOutTime: "11:00 AM",
  supportHours: "Front desk: 7:00 AM – 10:00 PM (GMT+8), daily",
  mapsEmbedUrl: orDefault(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL,
    "https://www.google.com/maps?q=White+Beach,+Boracay,+Malay,+Aklan,+Philippines&output=embed",
  ),
} as const;

/** Pricing rules used by the quote calculator (amounts in PHP). */
export const PRICING = {
  cleaningFee: 750,
  serviceFeeRate: 0.05, // 5% of room subtotal
  taxRate: 0.12, // 12% VAT applied to subtotal + fees
  longStayMinNights: 7,
  longStayDiscountRate: 0.1, // 10% off room subtotal for 7+ nights
  maxNights: 30,
} as const;

export const NAV_LINKS = [
  { href: "/rooms", label: "Rooms" },
  { href: "/cafe", label: "Cafe" },
  { href: "/gym", label: "Fitness" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const BOOKING_REFERENCE_PREFIX = "ASB";

export const COUNTRIES = [
  "Philippines",
  "Australia",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Malaysia",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Other",
] as const;

/* ────────────────────────────────────────────────────────────────────────────
 * Azure Sands Fitness — the gym module (/gym)
 * An on-property amenity of the condotel, with its own layout and navigation
 * so it can also be shown on its own.
 * ────────────────────────────────────────────────────────────────────────── */
export const GYM = {
  name: "Azure Sands Fitness",
  shortName: "Azure Sands Fitness",
  tagline: "Train Where You Stay",
  description:
    "Azure Sands Fitness is the resort gym on the ground floor of Azure Sands Boracay — free weights, a cardio deck, a functional turf zone, and coached classes six days a week. Open to guests, residents, and island locals.",
  phone: "+63 900 000 0001",
  email: "fitness@azuresandsboracay.example",
  address:
    "Ground Floor, Azure Sands Boracay, Station 2, White Beach Path, Balabag, Boracay Island, Malay, Aklan 5608, Philippines",
  hoursLabel: "Open daily, 5:00 AM – 11:00 PM",
  openHour: 5,
  closeHour: 23,
} as const;

export const GYM_NAV_LINKS = [
  { href: "/gym", label: "Overview" },
  { href: "/gym/schedule", label: "Class schedule" },
  { href: "/gym#plans", label: "Membership" },
  { href: "/gym#trainers", label: "Coaches" },
] as const;

export const GYM_REFERENCE_PREFIX = "ASF";

/* ────────────────────────────────────────────────────────────────────────────
 * Azure Sands Cafe — the food ordering module (/cafe)
 * ────────────────────────────────────────────────────────────────────────── */
export const CAFE = {
  name: "Azure Sands Cafe",
  shortName: "Azure Sands Cafe",
  tagline: "Island comfort food, brought to your room",
  description:
    "Azure Sands Cafe serves Filipino favourites, sizzling plates, and all-day breakfast from the ground floor of Azure Sands Boracay. Order ahead for pickup, have it delivered along White Beach, or charge it straight to your room.",
  phone: "+63 900 000 0002",
  email: "cafe@azuresandsboracay.example",
  address:
    "Ground Floor, Azure Sands Boracay, Station 2, White Beach Path, Balabag, Boracay Island, Malay, Aklan 5608, Philippines",
  hoursLabel: "Kitchen open 6:00 AM – 10:00 PM, daily",
  /** Kitchen hours in Philippine local time (GMT+8), 24-hour clock. */
  openHour: 6,
  closeHour: 22,
} as const;

export const CAFE_NAV_LINKS = [
  { href: "/cafe", label: "The cafe" },
  { href: "/cafe/menu", label: "Menu" },
  { href: "/cafe/track", label: "Track an order" },
] as const;

/** Order pricing rules (amounts in PHP; menu prices are VAT-inclusive). */
export const CAFE_PRICING = {
  /** Added to in-room deliveries, the way resort room service is billed. */
  roomServiceRate: 0.1,
  /** Flat fee for delivery along White Beach and the nearby stations. */
  deliveryFee: 59,
  /** Minimum order value before we send a runner out. */
  deliveryMinimum: 500,
  /** Guard rails on a single order. */
  maxLineQty: 20,
  maxLines: 25,
} as const;

export const CAFE_REFERENCE_PREFIX = "ASC";

/** Where island delivery reaches. Shown at checkout. */
export const DELIVERY_AREA = "Station 1, 2, and 3 along White Beach, plus Bulabog";
