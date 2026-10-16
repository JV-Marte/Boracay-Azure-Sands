import { isAfter, isValid, parseISO } from "date-fns";
import { z } from "zod";
import { CAFE_PRICING, PRICING } from "@/lib/constants";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker to choose a date")
  .refine((v) => isValid(parseISO(v)), "That date doesn't exist");

const dateRangeFields = {
  checkIn: isoDate,
  checkOut: isoDate,
};

function checkOutAfterCheckIn(data: { checkIn: string; checkOut: string }) {
  return isAfter(parseISO(data.checkOut), parseISO(data.checkIn));
}

export const searchSchema = z
  .object({
    ...dateRangeFields,
    guests: z.coerce.number().int().min(1, "At least 1 guest").max(10),
  })
  .refine(checkOutAfterCheckIn, {
    message: "Check-out must be after check-in (minimum stay is 1 night)",
    path: ["checkOut"],
  });

export const guestInfoSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(2, "Please enter the guest's full name")
    .max(120),
  guestEmail: z.email("Enter a valid email address").max(200),
  guestPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(30)
    .regex(/^[+\d][\d\s\-()]+$/, "Enter a valid phone number"),
  country: z.string().trim().min(2, "Select your country").max(80),
  specialRequests: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const bookingRequestSchema = z
  .object({
    roomId: z.string().min(1, "Choose a room"),
    ...dateRangeFields,
    guestCount: z.coerce.number().int().min(1).max(10),
    promoCode: z.string().trim().max(40).optional().or(z.literal("")),
    paymentMethod: z.enum(["pay_later", "card", "gcash", "maya", "bank_transfer"]),
    ...guestInfoSchema.shape,
  })
  .refine(checkOutAfterCheckIn, {
    message: "Check-out must be after check-in (minimum stay is 1 night)",
    path: ["checkOut"],
  });

export type BookingRequest = z.infer<typeof bookingRequestSchema>;

export const manageLookupSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(6, "Enter your booking reference (e.g. ASB-7KQ2MX9C)")
    .max(20),
  email: z.email("Enter the email used for the booking"),
});

export const updateGuestSchema = manageLookupSchema.extend({
  guestName: guestInfoSchema.shape.guestName,
  guestPhone: guestInfoSchema.shape.guestPhone,
  specialRequests: guestInfoSchema.shape.specialRequests,
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more so we can help (at least 10 characters)")
    .max(2000),
});

export const promoValidateSchema = z.object({
  code: z.string().trim().min(1, "Enter a promo code").max(40),
});

// ---- Admin schemas ---------------------------------------------------------

export const adminLoginSchema = z.object({
  email: z.email("Enter your admin email"),
  password: z.string().min(1, "Enter your password"),
});

export const roomSchema = z.object({
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(3000),
  room_type: z.enum(["studio", "suite", "loft"]),
  price_per_night: z.coerce.number().int().min(500).max(500000),
  max_guests: z.coerce.number().int().min(1).max(10),
  bed_type: z.enum(["queen", "king", "two_queens", "king_and_queen"]),
  bed_summary: z.string().trim().min(3).max(200),
  room_size: z.coerce.number().int().min(10).max(500),
  amenities: z.array(z.string()).min(1, "Pick at least one amenity"),
  images: z.array(z.string().trim().min(1)).min(1, "Add at least one image path"),
  status: z.enum(["active", "inactive"]),
});

export const blockedDateSchema = z
  .object({
    roomId: z.string().min(1),
    startDate: isoDate,
    endDate: isoDate,
    reason: z.string().trim().max(200).optional().or(z.literal("")),
  })
  .refine((d) => isAfter(parseISO(d.endDate), parseISO(d.startDate)), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const promoCodeSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3)
      .max(40)
      .regex(/^[A-Za-z0-9-]+$/, "Letters, numbers, and dashes only"),
    discount_type: z.enum(["percent", "fixed"]),
    discount_value: z.coerce.number().min(1),
    valid_from: isoDate,
    valid_until: isoDate,
    usage_limit: z.coerce.number().int().min(1).nullable(),
    active: z.boolean(),
  })
  .refine(
    (d) => d.discount_type !== "percent" || d.discount_value <= 90,
    { message: "Percent discounts are capped at 90%", path: ["discount_value"] },
  );

export const bookingAdminUpdateSchema = z.object({
  booking_status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  payment_status: z.enum(["pending", "paid", "refunded", "failed"]).optional(),
});


/* ── Azure Sands Fitness ──────────────────────────────────────────────────── */

const phoneField = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(30)
  .regex(/^[+\d][\d\s\-()]+$/, "Enter a valid phone number");

export const gymSignupSchema = z.object({
  planId: z.string().min(1, "Choose a membership"),
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.email("Enter a valid email address").max(200),
  phone: phoneField,
  preferredStart: isoDate,
  goal: z.string().trim().max(600).optional().or(z.literal("")),
  isHotelGuest: z.boolean().default(false),
});

export type GymSignupRequest = z.infer<typeof gymSignupSchema>;

export const gymSignupAdminUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "enrolled", "declined"]),
});

/* ── Azure Sands Cafe ─────────────────────────────────────────────────────── */

const cartLineSchema = z.object({
  itemId: z.string().min(1),
  qty: z.coerce.number().int().min(1).max(CAFE_PRICING.maxLineQty),
  notes: z.string().trim().max(200).optional().or(z.literal("")),
});

const orderBaseFields = {
  lines: z.array(cartLineSchema).min(1, "Your cart is empty").max(CAFE_PRICING.maxLines),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
};

/**
 * Each fulfillment mode asks for different things, so the payload is a
 * discriminated union rather than one object full of optional fields.
 */
export const foodOrderSchema = z.discriminatedUnion("fulfillmentType", [
  z.object({
    ...orderBaseFields,
    fulfillmentType: z.literal("room_delivery"),
    bookingReference: z
      .string()
      .trim()
      .min(6, "Enter your booking reference (e.g. ASB-7KQ2MX9C)")
      .max(20),
    email: z.email("Enter the email used for the booking"),
    roomNote: z.string().trim().max(200).optional().or(z.literal("")),
  }),
  z.object({
    ...orderBaseFields,
    fulfillmentType: z.literal("pickup"),
    customerName: z.string().trim().min(2, "Please enter your name").max(120),
    customerPhone: phoneField,
    pickupTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Choose a pickup time")
      .optional()
      .or(z.literal("")),
  }),
  z.object({
    ...orderBaseFields,
    fulfillmentType: z.literal("island_delivery"),
    customerName: z.string().trim().min(2, "Please enter your name").max(120),
    customerPhone: phoneField,
    deliveryAddress: z
      .string()
      .trim()
      .min(10, "Give us a street and barangay we can find")
      .max(300),
    landmark: z.string().trim().max(160).optional().or(z.literal("")),
  }),
]);

export type FoodOrderRequest = z.infer<typeof foodOrderSchema>;

export const foodOrderLookupSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(6, "Enter your order reference (e.g. RSC-7KQ2MX9C)")
    .max(20),
  phone: z.string().trim().min(4, "Enter the phone number on the order").max(30),
});

export const foodOrderAdminUpdateSchema = z.object({
  status: z.enum([
    "received",
    "preparing",
    "ready",
    "out_for_delivery",
    "completed",
    "cancelled",
  ]),
});

export { PRICING };
