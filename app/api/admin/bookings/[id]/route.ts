import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { bookingAdminUpdateSchema } from "@/lib/validation/schemas";
import { adminUpdateBooking } from "@/services/bookings";
import { toErrorResponse } from "@/services/errors";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = bookingAdminUpdateSchema.safeParse(body);
    if (!parsed.success || Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "Nothing valid to update." }, { status: 400 });
    }
    const booking = await adminUpdateBooking(id, parsed.data);
    return NextResponse.json({ booking });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
