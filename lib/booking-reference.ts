import { randomBytes } from "crypto";
import { BOOKING_REFERENCE_PREFIX } from "@/lib/constants";

// Unambiguous alphabet (no 0/O, 1/I/L) for references read over the phone.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Generate a booking reference like "ASB-7KQ2MX9C". */
export function generateBookingReference() {
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `${BOOKING_REFERENCE_PREFIX}-${code}`;
}

export function normalizeReference(input: string) {
  return input.trim().toUpperCase();
}
