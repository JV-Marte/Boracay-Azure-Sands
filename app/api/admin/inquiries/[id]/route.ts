import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth";
import { toErrorResponse } from "@/services/errors";
import { updateInquiryStatus } from "@/services/inquiries";

const patchSchema = z.object({
  status: z.enum(["new", "in_progress", "resolved"]),
});

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
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Nothing valid to update." }, { status: 400 });
    }
    await updateInquiryStatus(id, parsed.data.status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
