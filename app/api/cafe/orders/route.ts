import { NextResponse } from "next/server";
import { foodOrderSchema } from "@/lib/validation/schemas";
import { toErrorResponse } from "@/services/errors";
import { createFoodOrder } from "@/services/food-orders";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = foodOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
        { status: 400 },
      );
    }
    const order = await createFoodOrder(parsed.data);
    return NextResponse.json(
      { reference: order.reference, total: order.total },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
