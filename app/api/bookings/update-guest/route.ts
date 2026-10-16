import { NextResponse } from "next/server";
import { updateGuestSchema } from "@/lib/validation/schemas";
import { updateGuestInfo } from "@/services/bookings";
import { toErrorResponse } from "@/services/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = updateGuestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
        { status: 400 },
      );
    }
    const { reference, email, ...patch } = parsed.data;
    const booking = await updateGuestInfo(reference, email, patch);
    return NextResponse.json({ booking });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
