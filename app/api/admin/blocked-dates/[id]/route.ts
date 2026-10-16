import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { deleteBlockedDate } from "@/services/blocked-dates";
import { toErrorResponse } from "@/services/errors";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await deleteBlockedDate(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
