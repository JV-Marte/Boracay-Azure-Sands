import type { Attraction } from "@/types";

/**
 * Distances are editable placeholders (marked with *) until the final property
 * address is confirmed — update them in one place here.
 */
export const ATTRACTIONS: Attraction[] = [
  {
    name: "White Beach",
    description:
      "Four kilometers of powder-fine sand and the island's famous sunset. Stations 1–3 line up beach bars, paraw sailing, and calm, swimmable water.",
    distance: "Short walk*",
    image: "/images/white-beach.jpg",
  },
  {
    name: "D'Mall",
    description:
      "Boracay's open-air hub for restaurants, souvenirs, pharmacies, and money changers — everything you forgot to pack is here.",
    distance: "~5 min*",
    image: "/images/beach-day.jpg",
  },
  {
    name: "Bulabog Beach",
    description:
      "The island's wind sports playground. From November to April, kiteboarders and windsurfers fill the bay; the rest of the year it's a quiet local beach.",
    distance: "~10 min*",
    image: "/images/bulabog-beach.jpg",
  },
  {
    name: "Willy's Rock",
    description:
      "Boracay's most photographed landmark — a volcanic outcrop topped with a grotto, best visited at low tide near Station 1.",
    distance: "~15 min*",
    image: "/images/willys-rock.jpg",
  },
  {
    name: "Boracay Newcoast",
    description:
      "The island's newest district: a long, uncrowded beach, seaside promenades, and a growing lineup of cafés away from the Station 2 buzz.",
    distance: "~20 min by e-trike*",
    image: "/images/boracay-location.jpg",
  },
  {
    name: "Caticlan Airport & Jetty Port",
    description:
      "Your gateway to the island. Flights land at Caticlan (MPH), then it's a quick ferry across the channel — we can arrange the whole transfer.",
    distance: "~45 min door-to-door*",
    image: "/images/beach-sunset.jpg",
  },
];
