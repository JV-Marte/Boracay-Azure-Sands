"use client";

import { ChevronDown, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, bookingStatusTone, paymentStatusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  BOOKING_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/payments";
import { formatDate, formatPHP } from "@/lib/utils";
import type { Booking, BookingStatus, PaymentStatus } from "@/types";

const BOOKING_TRANSITIONS: Record<string, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: ["pending", "confirmed"],
  completed: [],
};

const PAYMENT_OPTIONS: PaymentStatus[] = ["pending", "paid", "refunded", "failed"];

export function BookingActions({
  booking,
  roomName,
}: {
  booking: Booking;
  roomName: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = async (patch: {
    booking_status?: BookingStatus;
    payment_status?: PaymentStatus;
  }) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Update failed.");
      toast("Booking updated.", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Eye className="size-3.5" aria-hidden />
        Manage
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Booking ${booking.booking_reference}`}
        className="max-w-xl"
      >
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone={bookingStatusTone(booking.booking_status)}>
              {BOOKING_STATUS_LABELS[booking.booking_status]}
            </Badge>
            <Badge tone={paymentStatusTone(booking.payment_status)}>
              {PAYMENT_STATUS_LABELS[booking.payment_status]}
            </Badge>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-400">Guest</dt>
              <dd className="mt-0.5 font-medium text-stone-900">{booking.guest_name}</dd>
              <dd className="text-stone-500">{booking.guest_email}</dd>
              <dd className="text-stone-500">{booking.guest_phone}</dd>
              <dd className="text-stone-500">{booking.country}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-400">Stay</dt>
              <dd className="mt-0.5 font-medium text-stone-900">{roomName}</dd>
              <dd className="text-stone-500">
                {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
              </dd>
              <dd className="text-stone-500">
                {booking.guest_count} guest{booking.guest_count === 1 ? "" : "s"} ·{" "}
                {PAYMENT_METHOD_LABELS[booking.payment_method]}
              </dd>
              <dd className="font-medium text-stone-900">{formatPHP(booking.total)}</dd>
            </div>
            {booking.special_requests && (
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-wider text-stone-400">
                  Special requests
                </dt>
                <dd className="mt-0.5 text-stone-700">{booking.special_requests}</dd>
              </div>
            )}
          </dl>

          <div className="space-y-3 border-t border-stone-100 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-stone-700">Booking status:</span>
              {BOOKING_TRANSITIONS[booking.booking_status].map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={status === "cancelled" ? "danger" : "secondary"}
                  disabled={saving}
                  onClick={() => update({ booking_status: status })}
                >
                  {status === "cancelled"
                    ? "Cancel booking"
                    : `Mark ${BOOKING_STATUS_LABELS[status].toLowerCase()}`}
                </Button>
              ))}
              {BOOKING_TRANSITIONS[booking.booking_status].length === 0 && (
                <span className="text-sm text-stone-400">No further actions.</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor={`pay-${booking.id}`}
                className="text-sm font-medium text-stone-700"
              >
                Payment status:
              </label>
              <div className="relative">
                <select
                  id={`pay-${booking.id}`}
                  value={booking.payment_status}
                  disabled={saving}
                  onChange={(e) =>
                    update({ payment_status: e.target.value as PaymentStatus })
                  }
                  className="h-9 appearance-none rounded-lg border border-stone-300 bg-white pl-3 pr-8 text-sm text-stone-800 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-200"
                >
                  {PAYMENT_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {PAYMENT_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
