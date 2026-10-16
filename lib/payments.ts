import type { PaymentMethod, PaymentStatus } from "@/types";

/**
 * Payment methods shown in the booking flow. All are mock/placeholder in this
 * build: bookings are stored with payment_status "pending" and settled at the
 * property or marked paid by the admin.
 *
 * Integration points (see README):
 *  - Card:   Stripe Checkout / PayMongo card element
 *  - GCash & Maya: PayMongo Sources API or Maya Checkout
 *  - Bank transfer: manual reconciliation
 */
export const PAYMENT_METHODS: Array<{
  key: PaymentMethod;
  label: string;
  description: string;
  note?: string;
}> = [
  {
    key: "pay_later",
    label: "Reserve now, pay at check-in",
    description: "No payment today. Settle in cash or card when you arrive.",
    note: "Most popular",
  },
  {
    key: "card",
    label: "Credit / debit card",
    description: "Visa, Mastercard, JCB, AmEx. Processed securely at confirmation.",
    note: "Placeholder — Stripe/PayMongo test mode",
  },
  {
    key: "gcash",
    label: "GCash",
    description: "Pay from your GCash wallet. We'll send a payment link.",
    note: "Placeholder integration",
  },
  {
    key: "maya",
    label: "Maya",
    description: "Pay from your Maya wallet. We'll send a payment link.",
    note: "Placeholder integration",
  },
  {
    key: "bank_transfer",
    label: "Bank transfer",
    description: "BPI / BDO transfer within 48 hours; details sent by email.",
  },
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> =
  Object.fromEntries(PAYMENT_METHODS.map((m) => [m.key, m.label])) as Record<
    PaymentMethod,
    string
  >;

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  paid: "Paid",
  refunded: "Refunded",
  failed: "Payment failed",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "Pending confirmation",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};
