import { NextResponse } from "next/server";
import { foodOrderLookupSchema } from "@/lib/validation/schemas";
import { toErrorResponse } from "@/services/errors";
import { findFoodOrder } from "@/services/food-orders";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = foodOrderLookupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check the reference and phone number." },
        { status: 400 },
      );
    }
    const order = await findFoodOrder(parsed.data.reference, parsed.data.phone);
    if (!order) {
      return NextResponse.json(
        {
          error:
            "We couldn't find an order with that reference and phone number. Double-check both and try again.",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({ reference: order.reference });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
