import { NextResponse } from "next/server";
import { promoValidateSchema } from "@/lib/validation/schemas";
import { toErrorResponse } from "@/services/errors";
import { getValidPromo } from "@/services/promos";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = promoValidateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Enter a promo code." },
        { status: 400 },
      );
    }
    const promo = await getValidPromo(parsed.data.code);
    return NextResponse.json({
      promo: {
        code: promo.code,
        discount_type: promo.discount_type,
        discount_value: promo.discount_value,
      },
    });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
