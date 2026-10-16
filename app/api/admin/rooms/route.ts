import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { roomSchema } from "@/lib/validation/schemas";
import { toErrorResponse } from "@/services/errors";
import { createRoom } from "@/services/rooms";

export async function POST(request: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => null);
    const parsed = roomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check the room details." },
        { status: 400 },
      );
    }
    const room = await createRoom(parsed.data);
    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
