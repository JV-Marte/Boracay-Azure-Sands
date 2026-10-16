import { CalendarRange, Download } from "lucide-react";
import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";
import { BookingActions } from "@/components/admin/BookingActions";
import { Badge, bookingStatusTone, paymentStatusTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/payments";
import { cn, formatDate, formatPHP } from "@/lib/utils";
import { listBookings } from "@/services/bookings";
import { listRooms } from "@/services/rooms";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "";
  const search = typeof params.q === "string" ? params.q : "";

  const [bookings, rooms] = await Promise.all([
    listBookings({ status: status || undefined, search: search || undefined }),
    listRooms({ includeInactive: true }),
  ]);
  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? "—";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-900">Bookings</h1>
          <p className="mt-1 text-sm text-stone-500">
            Confirm, cancel, and track payments for every reservation.
          </p>
        </div>
        {/* Plain anchor on purpose: this triggers a CSV file download, not a page navigation */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/admin/bookings/export"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-stone-300 bg-white px-4 text-sm font-medium text-stone-700 transition-colors hover:border-ocean-400 hover:text-ocean-700"
        >
          <Download className="size-4" aria-hidden />
          Export CSV
        </a>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <Link
              key={f.key}
              href={f.key ? `/admin/bookings?status=${f.key}` : "/admin/bookings"}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                status === f.key
                  ? "bg-ocean-600 text-white"
                  : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50",
              )}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        <form action="/admin/bookings" className="ml-auto flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="booking-search" className="sr-only">
            Search bookings
          </label>
          <input
            id="booking-search"
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search name, email, reference…"
            className="h-10 w-64 rounded-full border border-stone-300 bg-white px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-200"
          />
        </form>
      </div>

      <div className="mt-6">
        {bookings.length === 0 ? (
          <EmptyState
            icon={CalendarRange}
            title={search || status ? "No bookings match" : "No bookings yet"}
            description={
              search || status
                ? "Try a different status filter or search term."
                : "Bookings made on the website land here instantly."
            }
          />
        ) : (
          <AdminTable
            caption="All bookings"
            headers={[
              "Reference",
              "Guest",
              "Room",
              "Dates",
              "Total",
              "Status",
              "Payment",
              "Actions",
            ]}
          >
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-sand-50/50">
                <td className="px-4 py-3 font-mono text-xs text-stone-600">
                  {b.booking_reference}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{b.guest_name}</p>
                  <p className="text-xs text-stone-400">{b.guest_email}</p>
                </td>
                <td className="px-4 py-3 text-stone-600">{roomName(b.room_id)}</td>
                <td className="px-4 py-3 text-stone-600">
                  {formatDate(b.check_in)} → {formatDate(b.check_out)}
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">
                  {formatPHP(b.total)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={bookingStatusTone(b.booking_status)}>
                    {BOOKING_STATUS_LABELS[b.booking_status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={paymentStatusTone(b.payment_status)}>
                    {PAYMENT_STATUS_LABELS[b.payment_status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <BookingActions booking={b} roomName={roomName(b.room_id)} />
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </div>
    </div>
  );
}
