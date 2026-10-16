"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarX2, Pencil, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge, bookingStatusTone, paymentStatusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InputField, TextareaField } from "@/components/ui/Field";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  BOOKING_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/payments";
import { formatDate, formatPHP, pluralize } from "@/lib/utils";
import { manageLookupSchema } from "@/lib/validation/schemas";
import type { Booking, Room } from "@/types";

type LookupForm = z.infer<typeof manageLookupSchema>;

interface EditForm {
  guestName: string;
  guestPhone: string;
  specialRequests: string;
}

export function ManageBooking() {
  const { toast } = useToast();
  const [result, setResult] = useState<{ booking: Booking; room: Room | null } | null>(
    null,
  );
  const [credentials, setCredentials] = useState<LookupForm | null>(null);
  const [editing, setEditing] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const lookupForm = useForm<LookupForm>({ resolver: zodResolver(manageLookupSchema) });
  const editForm = useForm<EditForm>();

  const lookup = lookupForm.handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not find that booking.");
      setResult(body);
      setCredentials(data);
      setEditing(false);
      editForm.reset({
        guestName: body.booking.guest_name,
        guestPhone: body.booking.guest_phone,
        specialRequests: body.booking.special_requests ?? "",
      });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Network error — try again.", "error");
    }
  });

  const saveEdit = editForm.handleSubmit(async (data) => {
    if (!credentials) return;
    try {
      const res = await fetch("/api/bookings/update-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, ...data }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not update the booking.");
      setResult((prev) => (prev ? { ...prev, booking: body.booking } : prev));
      setEditing(false);
      toast("Guest details updated.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Network error — try again.", "error");
    }
  });

  const confirmCancel = async () => {
    if (!credentials) return;
    setCancelLoading(true);
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not cancel the booking.");
      setResult((prev) => (prev ? { ...prev, booking: body.booking } : prev));
      toast("Your booking has been cancelled. Sorry to miss you this time!", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Network error — try again.", "error");
    } finally {
      setCancelLoading(false);
      setCancelOpen(false);
    }
  };

  const booking = result?.booking;
  const room = result?.room;
  const cancellable =
    booking &&
    ["pending", "confirmed"].includes(booking.booking_status) &&
    booking.check_in > new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Lookup */}
      <Card className="p-6 sm:p-8">
        <h2 className="font-display text-xl font-medium text-ink-900">
          Find your booking
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Use the reference from your confirmation email plus the email you
          booked with.
        </p>
        <form onSubmit={lookup} noValidate className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <InputField
            label="Booking reference"
            placeholder="ASB-XXXXXXXX"
            required
            error={lookupForm.formState.errors.reference?.message}
            className="uppercase placeholder:normal-case"
            {...lookupForm.register("reference")}
          />
          <InputField
            label="Email address"
            type="email"
            required
            error={lookupForm.formState.errors.email?.message}
            {...lookupForm.register("email")}
          />
          <Button
            type="submit"
            loading={lookupForm.formState.isSubmitting}
            className="sm:mb-0"
          >
            <Search className="size-4" aria-hidden />
            Find booking
          </Button>
        </form>
      </Card>

      {/* Details */}
      {booking && (
        <Card className="p-6 sm:p-8 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink-900">
                {room?.name ?? "Your suite"}
              </h2>
              <p className="mt-1 font-mono text-sm tracking-widest text-stone-500">
                {booking.booking_reference}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge tone={bookingStatusTone(booking.booking_status)}>
                {BOOKING_STATUS_LABELS[booking.booking_status]}
              </Badge>
              <Badge tone={paymentStatusTone(booking.payment_status)}>
                {PAYMENT_STATUS_LABELS[booking.payment_status]}
              </Badge>
            </div>
          </div>

          <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-stone-100 pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Stay
              </dt>
              <dd className="mt-1 text-[15px] font-medium text-stone-900">
                {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Guests
              </dt>
              <dd className="mt-1 text-[15px] font-medium text-stone-900">
                {pluralize(booking.guest_count, "guest")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Payment
              </dt>
              <dd className="mt-1 text-[15px] font-medium text-stone-900">
                {PAYMENT_METHOD_LABELS[booking.payment_method]} ·{" "}
                {formatPHP(booking.total)}
              </dd>
            </div>
          </dl>

          {!editing ? (
            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Guest name
                </dt>
                <dd className="mt-1 text-[15px] text-stone-700">{booking.guest_name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Phone
                </dt>
                <dd className="mt-1 text-[15px] text-stone-700">{booking.guest_phone}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Special requests
                </dt>
                <dd className="mt-1 text-[15px] text-stone-700">
                  {booking.special_requests || "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <form onSubmit={saveEdit} className="mt-6 space-y-4 rounded-2xl bg-sand-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Guest name"
                  required
                  {...editForm.register("guestName", { required: true })}
                />
                <InputField
                  label="Phone"
                  type="tel"
                  required
                  {...editForm.register("guestPhone", { required: true })}
                />
              </div>
              <TextareaField
                label="Special requests"
                rows={3}
                {...editForm.register("specialRequests")}
              />
              <div className="flex gap-3">
                <Button type="submit" loading={editForm.formState.isSubmitting}>
                  Save changes
                </Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  Discard
                </Button>
              </div>
            </form>
          )}

          {booking.booking_status !== "cancelled" && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-stone-100 pt-6">
              {!editing && booking.booking_status !== "completed" && (
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <Pencil className="size-4" aria-hidden />
                  Edit guest details
                </Button>
              )}
              {cancellable && (
                <Button variant="danger" onClick={() => setCancelOpen(true)}>
                  <CalendarX2 className="size-4" aria-hidden />
                  Cancel booking
                </Button>
              )}
            </div>
          )}

          {booking.booking_status === "cancelled" && (
            <p className="mt-6 rounded-xl bg-stone-50 p-4 text-sm text-stone-500">
              This booking is cancelled
              {booking.payment_status === "refunded" &&
                " — your refund is being processed (5–10 business days)"}
              . We’d love to host you another time.
            </p>
          )}
        </Card>
      )}

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancel}
        loading={cancelLoading}
        title="Cancel this booking?"
        description={`This releases your dates immediately. ${
          booking?.payment_status === "paid"
            ? "Your payment will be refunded per the cancellation policy (5–10 business days)."
            : "You haven't been charged, so there's nothing to refund."
        }`}
        confirmLabel="Yes, cancel my booking"
      />
    </div>
  );
}
