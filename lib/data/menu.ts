import {
  Beef,
  Cake,
  CupSoda,
  EggFried,
  Flame,
  Leaf,
  Pizza,
  Sandwich,
  Star,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { MenuItem, MenuTag } from "@/types";

export interface MenuCategoryDef {
  key: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
}

export const MENU_CATEGORIES: MenuCategoryDef[] = [
  {
    key: "breakfast",
    label: "All-Day Breakfast",
    blurb: "Silog plates served from 6 AM to close, because breakfast is not a time of day.",
    icon: EggFried,
  },
  {
    key: "filipino",
    label: "Filipino Favourites",
    blurb: "The dishes the kitchen has been making the longest.",
    icon: UtensilsCrossed,
  },
  {
    key: "sizzling",
    label: "Sizzling Plates",
    blurb: "Served on cast iron, still spitting. Mind the plate.",
    icon: Flame,
  },
  {
    key: "pasta_pizza",
    label: "Pasta & Pizza",
    blurb: "Hand-stretched 10-inch pizzas and pasta made to order.",
    icon: Pizza,
  },
  {
    key: "snacks",
    label: "Sandwiches & Snacks",
    blurb: "Something quick between the beach, the pool, and a session at the gym.",
    icon: Sandwich,
  },
  {
    key: "desserts",
    label: "Desserts",
    blurb: "Cold, sweet, and non-negotiable in Boracay heat.",
    icon: Cake,
  },
  {
    key: "drinks",
    label: "Drinks",
    blurb: "Barako from Aklan, espresso from the lobby machine, fruit from the market.",
    icon: CupSoda,
  },
];

export const MENU_TAG_LABELS: Record<MenuTag, string> = {
  bestseller: "Bestseller",
  spicy: "Spicy",
  vegetarian: "Vegetarian",
  "chef-pick": "Chef's pick",
};

export const MENU_TAG_ICONS: Record<MenuTag, LucideIcon> = {
  bestseller: Star,
  spicy: Flame,
  vegetarian: Leaf,
  "chef-pick": Beef,
};

function item(
  slug: string,
  name: string,
  category: string,
  price: number,
  prep_minutes: number,
  description: string,
  tags: MenuTag[] = [],
): MenuItem {
  return {
    id: `menu-${slug}`,
    name,
    slug,
    category,
    description,
    price,
    image: `/images/cafe/menu/${slug}.jpg`,
    tags,
    prep_minutes,
    available: true,
  };
}

/** Prices are whole pesos and VAT-inclusive, the way a printed menu works here. */
export const MENU_ITEMS: MenuItem[] = [
  // ── All-Day Breakfast ─────────────────────────────────────────────────────
  item(
    "tapsilog",
    "Tapsilog",
    "breakfast",
    180,
    12,
    "Cured beef tapa, garlic fried rice, sunny-side egg, and a saucer of spiced vinegar.",
    ["bestseller"],
  ),
  item(
    "longsilog",
    "Longsilog",
    "breakfast",
    165,
    12,
    "Sweet native longganisa from the Malay market with garlic rice and egg.",
  ),
  item(
    "bangsilog",
    "Bangsilog",
    "breakfast",
    195,
    15,
    "Boneless milkfish belly fried crisp, garlic rice, egg, and salted tomato salsa.",
  ),
  item(
    "american-breakfast",
    "American Breakfast",
    "breakfast",
    260,
    15,
    "Two eggs any style, bacon, sausage, sautéed tomatoes, toast, and brewed coffee.",
  ),
  // ── Filipino Favourites ───────────────────────────────────────────────────
  item(
    "chicken-adobo",
    "Chicken Adobo",
    "filipino",
    230,
    18,
    "Braised in soy, cane vinegar, and a lot of garlic until the sauce goes glossy. Served with steamed rice.",
    ["bestseller"],
  ),
  item(
    "kare-kare",
    "Kare-Kare",
    "filipino",
    340,
    22,
    "Oxtail and tripe in a thick peanut stew with pechay, eggplant, and string beans. Bagoong on the side.",
    ["chef-pick"],
  ),
  item(
    "chicken-inasal",
    "Chicken Inasal",
    "filipino",
    195,
    20,
    "Quarter chicken marinated in calamansi, lemongrass, and annatto, grilled over coals. Comes with garlic rice and chicken oil.",
    ["bestseller"],
  ),
  item(
    "beef-caldereta",
    "Beef Caldereta",
    "filipino",
    295,
    22,
    "Slow-cooked beef in tomato and liver sauce with potatoes, carrots, and bell pepper.",
  ),
  item(
    "laing",
    "Laing sa Gata",
    "filipino",
    210,
    16,
    "Dried taro leaves simmered in coconut milk with pork belly and finger chilis.",
    ["spicy"],
  ),
  // ── Sizzling Plates ───────────────────────────────────────────────────────
  item(
    "sizzling-bangus",
    "Sizzling Bangus Belly",
    "sizzling",
    420,
    20,
    "A whole boneless belly on a screaming-hot plate with onions, butter, and calamansi.",
    ["chef-pick"],
  ),
  item(
    "sizzling-sisig",
    "Sizzling Pork Sisig",
    "sizzling",
    285,
    18,
    "Chopped pork jowl and ear, crisped and finished with egg, onion, and chili. Ask for extra calamansi.",
    ["bestseller", "spicy"],
  ),
  item(
    "sizzling-tofu",
    "Sizzling Tofu",
    "sizzling",
    195,
    14,
    "Golden tofu cubes with mushrooms, bell pepper, and a soy-oyster glaze.",
    ["vegetarian"],
  ),
  // ── Pasta & Pizza ─────────────────────────────────────────────────────────
  item(
    "chorizo-pizza",
    "Island Chorizo Pizza",
    "pasta_pizza",
    380,
    20,
    "Ten-inch hand-stretched crust with Aklan chorizo, red onion, mozzarella, and a scatter of chili flakes.",
    ["chef-pick"],
  ),
  item(
    "four-cheese-pizza",
    "Four Cheese Pizza",
    "pasta_pizza",
    360,
    20,
    "Mozzarella, cheddar, parmesan, and kesong puti on a ten-inch crust, finished with honey.",
    ["vegetarian"],
  ),
  item(
    "carbonara",
    "Carbonara",
    "pasta_pizza",
    240,
    16,
    "Cream, egg yolk, bacon, and parmesan over fettuccine. The version everyone here grew up with.",
  ),
  item(
    "baked-lasagna",
    "Baked Lasagna",
    "pasta_pizza",
    270,
    18,
    "Five layers, beef and tomato ragù, béchamel, baked until the edges catch.",
  ),
  // ── Sandwiches & Snacks ───────────────────────────────────────────────────
  item(
    "clubhouse-sandwich",
    "Clubhouse Sandwich",
    "snacks",
    240,
    12,
    "Triple-decker with roast chicken, bacon, egg, tomato, and lettuce. Fries included.",
  ),
  item(
    "azure-burger",
    "Azure Burger",
    "snacks",
    265,
    15,
    "Quarter-pound patty, cheddar, caramelised onion, house sauce, brioche bun, fries on the side.",
    ["bestseller"],
  ),
  item(
    "buffalo-wings",
    "Buffalo Wings",
    "snacks",
    250,
    18,
    "Six wings tossed in hot sauce and butter with a blue-cheese dip.",
    ["spicy"],
  ),
  item(
    "calamares",
    "Calamares",
    "snacks",
    220,
    14,
    "Squid rings in a light batter with spiced vinegar and garlic mayo.",
  ),
  item(
    "cheese-sticks",
    "Cheese Sticks",
    "snacks",
    140,
    10,
    "Eight crisp rolls of melted cheese with a sweet chili dip.",
    ["vegetarian"],
  ),
  // ── Desserts ──────────────────────────────────────────────────────────────
  item(
    "halo-halo",
    "Halo-Halo Especial",
    "desserts",
    180,
    8,
    "Shaved ice, sweet beans, nata de coco, leche flan, ube halaya, and a scoop of ube ice cream.",
    ["bestseller"],
  ),
  item(
    "mango-graham",
    "Mango Graham Float",
    "desserts",
    150,
    5,
    "Layered cream, graham crackers, and ripe Guimaras mango. Served properly cold.",
    ["vegetarian"],
  ),
  item(
    "leche-flan",
    "Leche Flan",
    "desserts",
    130,
    5,
    "Steamed custard with a dark caramel top. One slice, no shortcuts.",
    ["vegetarian"],
  ),
  // ── Drinks ────────────────────────────────────────────────────────────────
  item(
    "barako-coffee",
    "Barako Brewed Coffee",
    "drinks",
    95,
    5,
    "Aklan-grown liberica, brewed strong. Free refills if you drink it in the cafe.",
    ["vegetarian"],
  ),
  item(
    "cafe-latte",
    "Café Latte",
    "drinks",
    140,
    6,
    "Double shot with steamed milk. Hot or iced.",
    ["vegetarian"],
  ),
  item(
    "mango-shake",
    "Fresh Mango Shake",
    "drinks",
    165,
    6,
    "Ripe mango, ice, a little condensed milk. Nothing from a bottle.",
    ["bestseller", "vegetarian"],
  ),
  item(
    "calamansi-juice",
    "Calamansi Juice",
    "drinks",
    90,
    4,
    "Freshly squeezed, served over ice. Hot honey-calamansi on request.",
    ["vegetarian"],
  ),
  item(
    "iced-tea-pitcher",
    "House Iced Tea (Pitcher)",
    "drinks",
    120,
    4,
    "A litre of lightly sweetened lemon iced tea. Meant for sharing.",
    ["vegetarian"],
  ),
];

const itemsById = new Map(MENU_ITEMS.map((i) => [i.id, i]));

export function getMenuItem(id: string): MenuItem | undefined {
  return itemsById.get(id);
}

export function itemsByCategory(category: string): MenuItem[] {
  return MENU_ITEMS.filter((i) => i.category === category);
}

/** Shown on the cafe landing page. */
export const FEATURED_ITEM_IDS = [
  "menu-sizzling-sisig",
  "menu-chicken-inasal",
  "menu-chorizo-pizza",
  "menu-halo-halo",
  "menu-tapsilog",
  "menu-mango-shake",
] as const;
