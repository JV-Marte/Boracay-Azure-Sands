export const SITE = {
  name: "Azure Sands Boracay Condotel",
  shortName: "Azure Sands",
  tagline: "Your Island Stay in the Heart of Boracay",
  description:
    "Azure Sands is a boutique condotel steps from White Beach, Boracay — spacious island suites with kitchenettes, a pool, and warm Filipino hospitality for couples, families, and long-stay guests.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Contact placeholders — replace with real details before launch
  phone: "+63 900 000 0000",
  email: "stay@azuresandsboracay.example",
  whatsapp: "+639000000000",
  address: "Station 2, White Beach Path, Balabag, Boracay Island, Malay, Aklan 5608, Philippines",
  checkInTime: "2:00 PM",
  checkOutTime: "11:00 AM",
  supportHours: "Front desk: 7:00 AM – 10:00 PM (GMT+8), daily",
  mapsEmbedUrl:
    // `||` not `??`: an empty env var would otherwise render <iframe src="">
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps?q=White+Beach,+Boracay,+Malay,+Aklan,+Philippines&output=embed",
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
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
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
