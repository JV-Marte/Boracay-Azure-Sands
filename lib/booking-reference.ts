import { randomBytes } from "crypto";
import { BOOKING_REFERENCE_PREFIX } from "@/lib/constants";

// Unambiguous alphabet (no 0/O, 1/I/L) for references read over the phone.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Generate a human-readable reference like "ASB-7KQ2MX9C". Each module uses
 * its own prefix: ASB (condotel booking), RFC (gym signup), RSC (cafe order).
 */
export function generateReference(prefix: string = BOOKING_REFERENCE_PREFIX) {
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `${prefix}-${code}`;
}

/** Generate a condotel booking reference like "ASB-7KQ2MX9C". */
export function generateBookingReference() {
  return generateReference(BOOKING_REFERENCE_PREFIX);
}

export function normalizeReference(input: string) {
  return input.trim().toUpperCase();
}
