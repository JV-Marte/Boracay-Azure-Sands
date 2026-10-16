import { NextResponse } from "next/server";
import { gymSignupSchema } from "@/lib/validation/schemas";
import { toErrorResponse } from "@/services/errors";
import { createGymSignup } from "@/services/gym";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = gymSignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
        { status: 400 },
      );
    }
    const signup = await createGymSignup(parsed.data);
    return NextResponse.json({ reference: signup.reference }, { status: 201 });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
