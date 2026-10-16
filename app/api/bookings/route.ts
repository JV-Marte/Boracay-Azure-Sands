import { NextResponse } from "next/server";
import { sendBookingConfirmation } from "@/lib/email/booking-confirmation";
import { bookingRequestSchema } from "@/lib/validation/schemas";
import { createBooking } from "@/services/bookings";
import { toErrorResponse } from "@/services/errors";
import { getRoomById } from "@/services/rooms";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = bookingRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Please check your booking details and try again.",
        },
        { status: 400 },
      );
    }

    const booking = await createBooking(parsed.data);

    // Email failures are logged but never fail the booking.
    const room = await getRoomById(booking.room_id);
    const email = await sendBookingConfirmation(booking, room);

    return NextResponse.json(
      {
        reference: booking.booking_reference,
        email: booking.guest_email,
        emailSent: email.sent,
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
