import type { Metadata } from "next";
import { CircleCheck, Mail, Search } from "lucide-react";
import Image from "next/image";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import { PrintButton } from "@/components/booking/PrintButton";
import { Badge, bookingStatusTone, paymentStatusTone } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SITE } from "@/lib/constants";
import {
  BOOKING_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/payments";
import { computeQuote } from "@/lib/pricing";
import { formatDateLong, pluralize } from "@/lib/utils";
import { findBooking } from "@/services/bookings";
import { ServiceError } from "@/services/errors";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking confirmation",
  robots: { index: false },
};

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ reference }, query] = await Promise.all([params, searchParams]);
  const email = typeof query.email === "string" ? query.email : "";

  let result: Awaited<ReturnType<typeof findBooking>> | null = null;
  try {
    if (email) result = await findBooking(decodeURIComponent(reference), email);
  } catch (error) {
    if (!(error instanceof ServiceError)) throw error;
  }

  if (!result) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center sm:px-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-ocean-50">
          <Search className="size-6 text-ocean-600" aria-hidden />
        </div>
        <h1 className="mt-5 font-display text-3xl font-medium text-ink-900">
          We couldn’t open that confirmation
        </h1>
        <p className="mt-3 max-w-md text-stone-500">
          The link may be incomplete. Look up your booking with your reference
          number and the email you booked with.
        </p>
        <ButtonLink href="/manage-booking" className="mt-7">
          Find my booking
        </ButtonLink>
      </div>
    );
  }

  const { booking, room } = result;
  // Reconstruct the promo part of the breakdown from stored totals
  const quote = {
    ...computeQuote({
      pricePerNight: room?.price_per_night ?? Math.round(booking.subtotal),
      checkIn: booking.check_in,
      checkOut: booking.check_out,
    }),
    subtotal: booking.subtotal,
    fees: booking.fees,
    taxes: booking.taxes,
    discount: booking.discount,
    total: booking.total,
    promoCode: booking.promo_code,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
          <CircleCheck className="size-7 text-emerald-600" aria-hidden />
        </div>
        <h1 className="mt-5 font-display text-4xl font-medium tracking-[-0.03em] text-ink-900">
          See you on the island, {booking.guest_name.split(" ")[0]}!
        </h1>
        <p className="mt-3 max-w-lg text-stone-500">
          Your booking is in and{" "}
          {booking.booking_status === "confirmed" ? "confirmed" : "pending confirmation"}.
          A copy has been sent to <strong className="text-stone-700">{booking.guest_email}</strong>.
        </p>
        <div className="mt-6 rounded-2xl bg-ocean-50 px-8 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ocean-700">
            Booking reference
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-[0.15em] text-ocean-900">
            {booking.booking_reference}
          </p>
        </div>
      </div>

      <Card className="mt-10 overflow-hidden">
        {room && (
          <div className="relative h-44 w-full">
            <Image
              src={room.images[0] ?? "/images/property-exterior.jpg"}
              alt={`${room.name} photo`}
              fill
              sizes="(min-width: 768px) 48rem, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-medium text-ink-900">
              {room?.name ?? "Your suite"}
            </h2>
            <div className="flex gap-2">
              <Badge tone={bookingStatusTone(booking.booking_status)}>
                {BOOKING_STATUS_LABELS[booking.booking_status]}
              </Badge>
              <Badge tone={paymentStatusTone(booking.payment_status)}>
                {PAYMENT_STATUS_LABELS[booking.payment_status]}
              </Badge>
            </div>
          </div>

          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Check-in
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {formatDateLong(booking.check_in)}
                <span className="block text-sm font-normal text-stone-500">
                  from {SITE.checkInTime}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Check-out
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {formatDateLong(booking.check_out)}
                <span className="block text-sm font-normal text-stone-500">
                  by {SITE.checkOutTime}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Guests
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {pluralize(booking.guest_count, "guest")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Payment method
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {PAYMENT_METHOD_LABELS[booking.payment_method]}
              </dd>
            </div>
            {booking.special_requests && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Special requests
                </dt>
                <dd className="mt-1 text-stone-700">{booking.special_requests}</dd>
              </div>
            )}
          </dl>

          <PriceBreakdown quote={quote} className="mt-6 border-t border-stone-100 pt-4" />
        </div>
      </Card>

      <div className="no-print mt-8 flex flex-wrap items-center justify-center gap-3">
        <PrintButton />
        <ButtonLink href="/manage-booking" variant="outline">
          Manage this booking
        </ButtonLink>
        <ButtonLink href="/" variant="ghost">
          Back to home
        </ButtonLink>
      </div>

      <p className="no-print mt-8 flex items-start justify-center gap-2 text-center text-sm text-stone-400">
        <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
        Didn’t get the email? Check spam, or contact us at {SITE.email} with
        your reference.
      </p>
    </div>
  );
}
