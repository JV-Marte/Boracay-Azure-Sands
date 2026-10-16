import {
  AirVent,
  ArrowUpDown,
  Baby,
  BedDouble,
  Briefcase,
  Car,
  ChefHat,
  CookingPot,
  Bath,
  Luggage,
  Percent,
  Shield,
  Sparkles,
  Sun,
  Sunrise,
  Tv,
  UtensilsCrossed,
  WavesLadder,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

export interface AmenityDef {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Shown on the home page amenity grid */
  featured?: boolean;
  description?: string;
}

export const AMENITIES: AmenityDef[] = [
  { key: "wifi", label: "High-speed Wi-Fi", icon: Wifi, featured: true, description: "Fiber internet in every suite — solid enough for video calls and remote work." },
  { key: "aircon", label: "Air conditioning", icon: AirVent, featured: true, description: "Quiet split-type units in every room, serviced monthly." },
  { key: "pool", label: "Swimming pool", icon: WavesLadder, featured: true, description: "Free-form outdoor pool with loungers, open 7 AM to 9 PM." },
  { key: "beach_access", label: "Beach access", icon: Sun, featured: true, description: "A short stroll* to White Beach via a shaded walking path." },
  { key: "kitchenette", label: "Kitchenette", icon: CookingPot, featured: true, description: "Cook simple meals with induction hob, microwave, and fridge." },
  { key: "full_kitchen", label: "Full kitchen", icon: ChefHat },
  { key: "balcony", label: "Private balcony", icon: Wind, featured: true, description: "Every suite opens to fresh island air and natural light." },
  { key: "smart_tv", label: "Smart TV", icon: Tv },
  { key: "workspace", label: "Dedicated workspace", icon: Briefcase, featured: true, description: "A proper desk and chair for digital nomads and remote workers." },
  { key: "housekeeping", label: "Housekeeping", icon: Sparkles, featured: true, description: "Daily tidy-up and fresh towels; full linen change every 3 days." },
  { key: "airport_transfer", label: "Airport transfers", icon: Car, featured: true, description: "Arranged door-to-door from Caticlan Airport and the Jetty Port." },
  { key: "luggage_storage", label: "Luggage storage", icon: Luggage, featured: true, description: "Arrive early or leave late — we'll keep your bags safe for free." },
  { key: "family_friendly", label: "Family-friendly", icon: Baby, featured: true, description: "Cribs and high chairs on request; suites that sleep up to five." },
  { key: "long_stay", label: "Long-stay discounts", icon: Percent, featured: true, description: "Stay 7+ nights and save 10% automatically — no code needed." },
  { key: "security", label: "24/7 security", icon: Shield, featured: true, description: "Keycard access, CCTV in common areas, and round-the-clock staff." },
  { key: "bathtub", label: "Bathtub", icon: Bath },
  { key: "dining_area", label: "Dining area", icon: UtensilsCrossed },
  { key: "sofa_bed", label: "Sofa bed", icon: BedDouble },
  { key: "loft_layout", label: "Loft-style layout", icon: ArrowUpDown },
  { key: "ocean_view", label: "Ocean view", icon: Sunrise },
];

const byKey = new Map(AMENITIES.map((a) => [a.key, a]));

export function getAmenity(key: string): AmenityDef {
  return (
    byKey.get(key) ?? { key, label: key.replace(/_/g, " "), icon: Sparkles }
  );
}
