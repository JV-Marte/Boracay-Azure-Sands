import type { Faq } from "@/types";
import { SITE } from "@/lib/constants";

export const FAQS: Faq[] = [
  {
    category: "Check-in & check-out",
    question: "What time are check-in and check-out?",
    answer: `Check-in starts at ${SITE.checkInTime} and check-out is by ${SITE.checkOutTime}. Bring a valid ID matching the booking name.`,
  },
  {
    category: "Check-in & check-out",
    question: "Can I check in early?",
    answer:
      "We offer early check-in whenever the suite is ready, at no charge — just message us your arrival time. If you land in the morning, we'll store your luggage and text you the moment the room is available.",
  },
  {
    category: "Check-in & check-out",
    question: "Is late check-out possible?",
    answer:
      "Late check-out until 2:00 PM is subject to availability and a fee of ₱1,000. After 2:00 PM, a half-night rate applies. You're always welcome to leave bags with us and enjoy the beach after checking out.",
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer:
      "You can reserve now and pay on arrival, or pay online via credit/debit card, GCash, Maya, or bank transfer. Card payments are processed securely; we never store card details.",
  },
  {
    category: "Payments",
    question: "Do I need to pay a deposit?",
    answer:
      "For 'pay later' bookings we hold your room without a deposit for stays up to 5 nights. Longer stays and peak dates (Holy Week, Christmas, New Year) may require a 50% deposit to confirm.",
  },
  {
    category: "Cancellations & refunds",
    question: "What is the cancellation policy?",
    answer:
      "Free cancellation up to 7 days before check-in. Within 7 days, the first night is charged; within 48 hours or no-show, 50% of the total applies. To cancel, use the Manage Booking page with your reference number.",
  },
  {
    category: "Cancellations & refunds",
    question: "How long do refunds take?",
    answer:
      "Approved refunds are released within 5–10 business days to the original payment method. GCash and Maya refunds usually arrive faster than card refunds.",
  },
  {
    category: "Guests & families",
    question: "Are children welcome? Do they count as guests?",
    answer:
      "Absolutely — we're family-friendly. Children aged 6 and under stay free and don't count toward the guest limit (max one per booking). Cribs and high chairs are free on request.",
  },
  {
    category: "Guests & families",
    question: "Can I bring extra guests?",
    answer:
      "Each suite has a firm maximum for safety and comfort. An extra adult beyond capacity can't be accommodated, but our Family Suite (4 guests) and Premium Loft (5 guests) handle bigger groups well.",
  },
  {
    category: "Getting here",
    question: "Do you arrange airport transfers?",
    answer:
      "Yes. We arrange door-to-door transfers from Caticlan Airport (via the Jetty Port ferry) for ₱800 per person each way, and from Kalibo Airport for ₱1,200 per person. Book at least 24 hours ahead via the Contact page.",
  },
  {
    category: "Getting here",
    question: "How do I get from the airport to the property?",
    answer:
      "From Caticlan Airport it's a short trike ride to the Jetty Port, a 10–15 minute boat to Boracay, then a van or e-trike to the property. Our transfer service handles the whole chain, including terminal and environmental fees.",
  },
  {
    category: "Property & amenities",
    question: "Are pets allowed?",
    answer:
      "We can't accommodate pets at the moment, except registered service animals. Let us know in advance if you're traveling with a service animal so we can prepare.",
  },
  {
    category: "Property & amenities",
    question: "How fast is the Wi-Fi?",
    answer:
      "Every suite has fiber Wi-Fi rated for video calls and streaming (typically 100+ Mbps down). The Premium Loft and workspace-equipped suites are popular with remote workers for exactly this reason.",
  },
  {
    category: "Property & amenities",
    question: "How often is housekeeping?",
    answer:
      "Daily tidy-up service with fresh towels, and a full linen change every three days (or on request). Prefer privacy? Hang the sign and we'll skip you, no questions asked.",
  },
  {
    category: "Property & amenities",
    question: "Do you offer discounts for long stays?",
    answer:
      "Yes — stays of 7 nights or more get 10% off the room rate automatically at checkout. For stays of a month or longer, contact us for custom monthly rates.",
  },
  {
    category: "Property & amenities",
    question: "How close is the beach?",
    answer:
      "The property sits a short walk* from White Beach via a shaded path. (*Exact walking time will be confirmed with the final property address — placeholder pending.)",
  },
];
