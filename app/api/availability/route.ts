import { NextResponse } from "next/server";
import { isAfter, isValid, parseISO } from "date-fns";
import {
  getUnavailableRanges,
  isRoomAvailable,
} from "@/services/availability";
import { toErrorResponse } from "@/services/errors";

function isIsoDate(value: string | null): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(parseISO(value));
}

/**
 * GET /api/availability?roomId=xxx                      -> { ranges }
 * GET /api/availability?roomId=xxx&checkIn=..&checkOut=.. -> { available }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
  }

  try {
    if (isIsoDate(checkIn) && isIsoDate(checkOut)) {
      if (!isAfter(parseISO(checkOut), parseISO(checkIn))) {
        return NextResponse.json(
          { error: "Check-out must be after check-in." },
          { status: 400 },
        );
      }
      const available = await isRoomAvailable(roomId, checkIn, checkOut);
      return NextResponse.json({ available });
    }
    const ranges = await getUnavailableRanges(roomId);
    return NextResponse.json({ ranges });
  } catch (error) {
    const { message, status } = toErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
