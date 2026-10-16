import type { GalleryImage } from "@/types";

/**
 * Gallery photos — real room photography under public/images/rooms/<slug>/.
 * To add property/beach/pool categories later: drop photos into public/images,
 * add entries here with a new category key, and list the key in
 * GALLERY_CATEGORIES below.
 */
export const GALLERY_IMAGES: GalleryImage[] = [
  // Rooms & suites
  { src: "/images/rooms/deluxe-studio/interior.png", alt: "Deluxe Studio queen bed, kitchenette, and private balcony", category: "rooms" },
  { src: "/images/rooms/deluxe-studio/bedroom.png", alt: "Deluxe Studio queen bedroom in warm sand and woven island textures", category: "rooms" },
  { src: "/images/rooms/family-suite/interior.png", alt: "Family Suite with two queen beds, full kitchen, and four-seat dining area", category: "rooms" },
  { src: "/images/rooms/family-suite/bedroom.png", alt: "Family Suite two-queen sleeping area", category: "rooms" },
  { src: "/images/rooms/ocean-view-suite/interior.png", alt: "Ocean View Suite king bed facing its ocean balcony", category: "rooms" },
  { src: "/images/rooms/ocean-view-suite/bedroom.png", alt: "Ocean View Suite king bedroom with direct sea views", category: "rooms" },
  { src: "/images/rooms/premium-loft/interior.png", alt: "Premium Loft two-level layout with kitchen, dining, workspace, and staircase", category: "rooms" },
  { src: "/images/rooms/premium-loft/bedroom.png", alt: "Premium Loft king bed upstairs beneath the eaves", category: "rooms" },
  // Balconies & views
  { src: "/images/rooms/ocean-view-suite/balcony.png", alt: "Ocean-facing private balcony of the Ocean View Suite", category: "views" },
  { src: "/images/rooms/ocean-view-suite/view.png", alt: "Expansive turquoise ocean view from the Ocean View Suite", category: "views" },
  { src: "/images/rooms/deluxe-studio/balcony.png", alt: "Deluxe Studio private balcony with tropical sea views", category: "views" },
  { src: "/images/rooms/deluxe-studio/view.png", alt: "View toward White Beach from the Deluxe Studio", category: "views" },
  { src: "/images/rooms/family-suite/balcony.png", alt: "Spacious private balcony for Family Suite guests", category: "views" },
  { src: "/images/rooms/family-suite/view.png", alt: "Family Suite balcony view across palms to the sea", category: "views" },
  { src: "/images/rooms/premium-loft/balcony.png", alt: "Large private balcony of the Premium Loft", category: "views" },
  { src: "/images/rooms/premium-loft/view.png", alt: "Premium Loft view over tropical greenery and White Beach", category: "views" },
  // Bathrooms
  { src: "/images/rooms/ocean-view-suite/bathroom.png", alt: "Ocean View Suite bathroom with a deep soaking tub and sea view", category: "bathrooms" },
  { src: "/images/rooms/deluxe-studio/bathroom.png", alt: "Deluxe Studio rainfall-shower bathroom", category: "bathrooms" },
  { src: "/images/rooms/family-suite/bathroom.png", alt: "Family Suite tropical-modern bathroom", category: "bathrooms" },
  { src: "/images/rooms/premium-loft/bathroom.png", alt: "Premium Loft rainfall-shower bathroom", category: "bathrooms" },
];

export const GALLERY_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "rooms", label: "Rooms & suites" },
  { key: "views", label: "Balconies & views" },
  { key: "bathrooms", label: "Bathrooms" },
] as const;
