import type { GalleryImage } from "@/types";

/**
 * Gallery photos — room photography under public/images/rooms/<slug>/, plus the
 * two on-property venues that have their own sites at /cafe and /gym.
 * To add a category: drop photos into public/images, add entries here with a
 * new category key, widen GalleryImage["category"], and list the key in
 * GALLERY_CATEGORIES below.
 */
export const GALLERY_IMAGES: GalleryImage[] = [
  // Rooms & suites
  { src: "/images/rooms/deluxe-studio/interior.jpg", alt: "Deluxe Studio queen bed, kitchenette, and private balcony", category: "rooms" },
  { src: "/images/rooms/deluxe-studio/bedroom.jpg", alt: "Deluxe Studio queen bedroom in warm sand and woven island textures", category: "rooms" },
  { src: "/images/rooms/family-suite/interior.jpg", alt: "Family Suite with two queen beds, full kitchen, and four-seat dining area", category: "rooms" },
  { src: "/images/rooms/family-suite/bedroom.jpg", alt: "Family Suite two-queen sleeping area", category: "rooms" },
  { src: "/images/rooms/ocean-view-suite/interior.jpg", alt: "Ocean View Suite king bed facing its ocean balcony", category: "rooms" },
  { src: "/images/rooms/ocean-view-suite/bedroom.jpg", alt: "Ocean View Suite king bedroom with direct sea views", category: "rooms" },
  { src: "/images/rooms/premium-loft/interior.jpg", alt: "Premium Loft two-level layout with kitchen, dining, workspace, and staircase", category: "rooms" },
  { src: "/images/rooms/premium-loft/bedroom.jpg", alt: "Premium Loft king bed upstairs beneath the eaves", category: "rooms" },
  // Balconies & views
  { src: "/images/rooms/ocean-view-suite/balcony.jpg", alt: "Ocean-facing private balcony of the Ocean View Suite", category: "views" },
  { src: "/images/rooms/ocean-view-suite/view.jpg", alt: "Expansive turquoise ocean view from the Ocean View Suite", category: "views" },
  { src: "/images/rooms/deluxe-studio/balcony.jpg", alt: "Deluxe Studio private balcony with tropical sea views", category: "views" },
  { src: "/images/rooms/deluxe-studio/view.jpg", alt: "View toward White Beach from the Deluxe Studio", category: "views" },
  { src: "/images/rooms/family-suite/balcony.jpg", alt: "Spacious private balcony for Family Suite guests", category: "views" },
  { src: "/images/rooms/family-suite/view.jpg", alt: "Family Suite balcony view across palms to the sea", category: "views" },
  { src: "/images/rooms/premium-loft/balcony.jpg", alt: "Large private balcony of the Premium Loft", category: "views" },
  { src: "/images/rooms/premium-loft/view.jpg", alt: "Premium Loft view over tropical greenery and White Beach", category: "views" },
  // Bathrooms
  { src: "/images/rooms/ocean-view-suite/bathroom.jpg", alt: "Ocean View Suite bathroom with a deep soaking tub and sea view", category: "bathrooms" },
  { src: "/images/rooms/deluxe-studio/bathroom.jpg", alt: "Deluxe Studio rainfall-shower bathroom", category: "bathrooms" },
  { src: "/images/rooms/family-suite/bathroom.jpg", alt: "Family Suite tropical-modern bathroom", category: "bathrooms" },
  { src: "/images/rooms/premium-loft/bathroom.jpg", alt: "Premium Loft rainfall-shower bathroom", category: "bathrooms" },

  // Cafe & dining — Azure Sands Cafe, ground floor (see /cafe)
  { src: "/images/cafe/hero.jpg", alt: "The Azure Sands Cafe dining room, with rattan chairs and street-facing windows", category: "dining" },
  { src: "/images/cafe/interior.jpg", alt: "The cafe's coffee and pastry counter", category: "dining" },
  { src: "/images/cafe/room-service.jpg", alt: "An in-room dining tray delivered to a suite", category: "dining" },
  { src: "/images/cafe/menu/sizzling-sisig.jpg", alt: "Sizzling pork sisig served on a cast-iron plate", category: "dining" },
  { src: "/images/cafe/menu/chicken-inasal.jpg", alt: "Grilled chicken inasal with garlic rice and calamansi", category: "dining" },
  { src: "/images/cafe/menu/chorizo-pizza.jpg", alt: "Hand-stretched island chorizo pizza fresh from the oven", category: "dining" },
  { src: "/images/cafe/menu/halo-halo.jpg", alt: "Halo-halo especial topped with leche flan and ube ice cream", category: "dining" },

  // Fitness centre — Azure Sands Fitness, ground floor (see /gym)
  { src: "/images/gym/hero.jpg", alt: "The main training floor at Azure Sands Fitness", category: "fitness" },
  { src: "/images/gym/strength-zone.jpg", alt: "Free-weight area with dumbbell racks and squat racks", category: "fitness" },
  { src: "/images/gym/cardio-deck.jpg", alt: "Treadmills and bikes lined up along the windows", category: "fitness" },
  { src: "/images/gym/functional-turf.jpg", alt: "Functional training zone with turf, kettlebells, and a rig", category: "fitness" },
  { src: "/images/gym/group-studio.jpg", alt: "Mirrored group fitness studio used for yoga, Zumba, and HIIT", category: "fitness" },
  { src: "/images/gym/locker-room.jpg", alt: "Locker room with hot showers and fresh towels", category: "fitness" },
];

export const GALLERY_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "rooms", label: "Rooms & suites" },
  { key: "views", label: "Balconies & views" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "dining", label: "Cafe & dining" },
  { key: "fitness", label: "Fitness centre" },
] as const;
