import { NextResponse } from "next/server";
import { manageLookupSchema } from "@/lib/validation/schemas";
import { cancelBooking } from "@/services/bookings";
import { toErrorResponse } from "@/services/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = manageLookupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check the reference and email." },
        { status: 400 },
      );
    }
    const booking = await cancelBooking(parsed.data.reference, parsed.data.email);
    return NextResponse.json({ booking });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
