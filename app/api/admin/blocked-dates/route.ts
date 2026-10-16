import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { blockedDateSchema } from "@/lib/validation/schemas";
import { createBlockedDate } from "@/services/blocked-dates";
import { toErrorResponse } from "@/services/errors";

export async function POST(request: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => null);
    const parsed = blockedDateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check the dates." },
        { status: 400 },
      );
    }
    const block = await createBlockedDate(parsed.data);
    return NextResponse.json({ block }, { status: 201 });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
