import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { promoCodeSchema } from "@/lib/validation/schemas";
import { toErrorResponse } from "@/services/errors";
import { createPromoCode } from "@/services/promos";

export async function POST(request: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => null);
    const parsed = promoCodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check the promo code details." },
        { status: 400 },
      );
    }
    const promo = await createPromoCode(parsed.data);
    return NextResponse.json({ promo }, { status: 201 });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
