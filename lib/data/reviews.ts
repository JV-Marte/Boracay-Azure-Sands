import type { Review } from "@/types";

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: "rev-1",
    guest_name: "Marielle S.",
    rating: 5,
    comment:
      "The Family Suite was spotless and the kitchen saved us a fortune with two kids. Staff arranged our Caticlan transfer before we even asked. We'll be back in December.",
    stay_type: "Family stay · 5 nights",
    approved: true,
    created_at: "2026-03-02T09:00:00.000Z",
  },
  {
    id: "rev-2",
    guest_name: "Daniel & Priya",
    rating: 5,
    comment:
      "Booked the Ocean View Suite for our anniversary. Watching the sunset from the bathtub is something we still talk about. Quiet at night despite being close to Station 2.",
    stay_type: "Couple · 4 nights",
    approved: true,
    created_at: "2026-02-18T09:00:00.000Z",
  },
  {
    id: "rev-3",
    guest_name: "Tomás R.",
    rating: 4,
    comment:
      "Stayed a month in the Premium Loft while working remotely. Wi-Fi held up on every call, and the desk setup is legit. Only wish the pool opened earlier for morning laps.",
    stay_type: "Long stay · 30 nights",
    approved: true,
    created_at: "2026-01-27T09:00:00.000Z",
  },
  {
    id: "rev-4",
    guest_name: "Aiko N.",
    rating: 5,
    comment:
      "The Deluxe Studio is small but perfectly laid out — never felt cramped. Housekeeping was thoughtful and the balcony breeze in the morning is worth the trip alone.",
    stay_type: "Solo · 3 nights",
    approved: true,
    created_at: "2026-04-11T09:00:00.000Z",
  },
  {
    id: "rev-5",
    guest_name: "Chris B.",
    rating: 4,
    comment:
      "Great value for Boracay. Check-in was quick, luggage storage after check-out let us squeeze in one last beach afternoon before the ferry.",
    stay_type: "Friends · 2 nights",
    approved: true,
    created_at: "2026-05-06T09:00:00.000Z",
  },
  {
    id: "rev-6",
    guest_name: "Hannah L.",
    rating: 5,
    comment:
      "Booked last minute and the team still made it feel special — welcome fruit, early check-in, restaurant tips that were all spot on.",
    stay_type: "Couple · 3 nights",
    approved: false,
    created_at: "2026-06-20T09:00:00.000Z",
  },
];
