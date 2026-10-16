import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { foodOrderAdminUpdateSchema } from "@/lib/validation/schemas";
import { toErrorResponse } from "@/services/errors";
import { updateFoodOrderStatus } from "@/services/food-orders";

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
    const parsed = foodOrderAdminUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Nothing valid to update." }, { status: 400 });
    }
    await updateFoodOrderStatus(id, parsed.data.status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
