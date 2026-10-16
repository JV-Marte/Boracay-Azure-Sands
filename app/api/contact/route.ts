import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/schemas";
import { toErrorResponse } from "@/services/errors";
import { createInquiry } from "@/services/inquiries";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
        { status: 400 },
      );
    }
    const inquiry = await createInquiry(parsed.data);
    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
