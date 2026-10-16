import { requireAdminApi } from "@/lib/auth";
import { listBookings } from "@/services/bookings";
import { listRooms } from "@/services/rooms";

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET() {
  if (!(await requireAdminApi())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [bookings, rooms] = await Promise.all([
    listBookings(),
    listRooms({ includeInactive: true }),
  ]);
  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? id;

  const headers = [
    "booking_reference",
    "booking_status",
    "payment_status",
    "payment_method",
    "room",
    "guest_name",
    "guest_email",
    "guest_phone",
    "country",
    "check_in",
    "check_out",
    "guest_count",
    "subtotal",
    "fees",
    "taxes",
    "discount",
    "total",
    "promo_code",
    "special_requests",
    "created_at",
  ];

  const rows = bookings.map((b) =>
    [
      b.booking_reference,
      b.booking_status,
      b.payment_status,
      b.payment_method,
      roomName(b.room_id),
      b.guest_name,
      b.guest_email,
      b.guest_phone,
      b.country,
      b.check_in,
      b.check_out,
      b.guest_count,
      b.subtotal,
      b.fees,
      b.taxes,
      b.discount,
      b.total,
      b.promo_code ?? "",
      b.special_requests ?? "",
      b.created_at,
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const today = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="azure-sands-bookings-${today}.csv"`,
    },
  });
}
