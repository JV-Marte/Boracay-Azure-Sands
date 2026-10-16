import {
  CalendarCheck,
  CalendarRange,
  Hourglass,
  PhilippinePeso,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { AdminTable, StatCard } from "@/components/admin/AdminTable";
import { Badge, bookingStatusTone, paymentStatusTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/payments";
import { formatDate, formatPHP } from "@/lib/utils";
import { getAdminStats } from "@/services/stats";
import { listRooms } from "@/services/rooms";
import type { Booking, Room } from "@/types";

export const dynamic = "force-dynamic";

function roomName(rooms: Room[], id: string) {
  return rooms.find((r) => r.id === id)?.name ?? "—";
}

function MiniList({
  title,
  bookings,
  rooms,
  dateKey,
  emptyText,
}: {
  title: string;
  bookings: Booking[];
  rooms: Room[];
  dateKey: "check_in" | "check_out";
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-stone-900">{title}</h2>
      {bookings.length === 0 ? (
        <p className="mt-3 text-sm text-stone-400">{emptyText}</p>
      ) : (
        <ul className="mt-3 divide-y divide-stone-100">
          {bookings.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-stone-900">
                  {b.guest_name}
                </p>
                <p className="text-xs text-stone-400">
                  {roomName(rooms, b.room_id)} · {b.guest_count} guest
                  {b.guest_count === 1 ? "" : "s"}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium text-ocean-800">
                {formatDate(b[dateKey])}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [stats, rooms] = await Promise.all([
    getAdminStats(),
    listRooms({ includeInactive: true }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold text-stone-900">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">
        What’s happening at Azure Sands right now.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={String(stats.totalBookings)}
          hint={`${stats.pendingBookings} pending confirmation`}
          icon={<CalendarRange className="size-4.5 text-ocean-500" aria-hidden />}
        />
        <StatCard
          label="Revenue this month"
          value={formatPHP(stats.revenueThisMonth)}
          hint="Bookings created this month"
          icon={<PhilippinePeso className="size-4.5 text-palm-600" aria-hidden />}
        />
        <StatCard
          label="All-time revenue"
          value={formatPHP(stats.revenueTotal)}
          hint="Excludes cancelled bookings"
          icon={<TrendingUp className="size-4.5 text-palm-600" aria-hidden />}
        />
        <StatCard
          label="Occupancy · next 30 days"
          value={`${stats.occupancyRate}%`}
          hint="Booked or blocked room-nights"
          icon={<Hourglass className="size-4.5 text-sunset-500" aria-hidden />}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <MiniList
          title="Upcoming check-ins"
          bookings={stats.upcomingCheckIns}
          rooms={rooms}
          dateKey="check_in"
          emptyText="No upcoming check-ins yet."
        />
        <MiniList
          title="In-house & upcoming check-outs"
          bookings={stats.upcomingCheckOuts}
          rooms={rooms}
          dateKey="check_out"
          emptyText="No guests currently in-house."
        />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-stone-900">
            Recent bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm font-medium text-ocean-700 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        {stats.recentBookings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No bookings yet"
            description="New bookings from the website will appear here the moment they come in."
          />
        ) : (
          <AdminTable
            caption="Recent bookings"
            headers={["Reference", "Guest", "Room", "Dates", "Total", "Status", "Payment"]}
          >
            {stats.recentBookings.map((b) => (
              <tr key={b.id} className="hover:bg-sand-50/50">
                <td className="px-4 py-3 font-mono text-xs text-stone-600">
                  {b.booking_reference}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{b.guest_name}</p>
                  <p className="text-xs text-stone-400">{b.country}</p>
                </td>
                <td className="px-4 py-3 text-stone-600">{roomName(rooms, b.room_id)}</td>
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
              </tr>
            ))}
          </AdminTable>
        )}
      </div>
    </div>
  );
}
