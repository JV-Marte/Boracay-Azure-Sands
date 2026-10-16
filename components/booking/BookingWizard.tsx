"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarX2,
  Check,
  Tag,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import { Button } from "@/components/ui/Button";
import { InputField, SelectField, TextareaField } from "@/components/ui/Field";
import { COUNTRIES } from "@/lib/constants";
import { computeQuote, nightsBetween, type PromoLike } from "@/lib/pricing";
import { PAYMENT_METHODS } from "@/lib/payments";
import { cn, formatDate, formatPHP, pluralize } from "@/lib/utils";
import { bookingRequestSchema, type BookingRequest } from "@/lib/validation/schemas";
import type { Room } from "@/types";

const STEPS = ["Your stay", "Guest details", "Review", "Payment"] as const;

const STEP_FIELDS: Array<Array<keyof BookingRequest>> = [
  ["roomId", "checkIn", "checkOut", "guestCount"],
  ["guestName", "guestEmail", "guestPhone", "country", "specialRequests"],
  [],
  ["paymentMethod"],
];

interface BookingWizardProps {
  rooms: Room[];
  initial: {
    roomId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
}

export function BookingWizard({ rooms, initial }: BookingWizardProps) {
  const router = useRouter();
  const today = format(new Date(), "yyyy-MM-dd");
  const [step, setStep] = useState(0);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [promo, setPromo] = useState<PromoLike | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submittedRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BookingRequest>({
    // Cast needed because z.coerce makes the schema's input type `unknown`
    resolver: zodResolver(bookingRequestSchema) as Resolver<BookingRequest>,
    mode: "onTouched",
    defaultValues: {
      roomId: initial.roomId ?? "",
      checkIn: initial.checkIn ?? "",
      checkOut: initial.checkOut ?? "",
      guestCount: initial.guests ?? 2,
      paymentMethod: "pay_later",
      country: "Philippines",
      specialRequests: "",
      promoCode: "",
    },
  });

  const roomId = watch("roomId");
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const guestCount = watch("guestCount");
  const paymentMethod = watch("paymentMethod");

  const room = rooms.find((r) => r.id === roomId) ?? null;
  const nights =
    checkIn && checkOut && checkOut > checkIn ? nightsBetween(checkIn, checkOut) : 0;
  const quote =
    room && nights > 0
      ? computeQuote({ pricePerNight: room.price_per_night, checkIn, checkOut, promo })
      : null;

  const goNext = async () => {
    setSubmitError(null);
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (!valid) return;

    if (step === 0) {
      if (room && guestCount > room.max_guests) {
        setAvailabilityError(
          `${room.name} sleeps up to ${room.max_guests} guests — pick a larger suite or fewer guests.`,
        );
        return;
      }
      setCheckingAvailability(true);
      setAvailabilityError(null);
      try {
        const res = await fetch(
          `/api/availability?roomId=${encodeURIComponent(roomId)}&checkIn=${checkIn}&checkOut=${checkOut}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not check availability.");
        if (!data.available) {
          setAvailabilityError(
            "This room isn't available for those dates. Try different dates or another suite.",
          );
          return;
        }
      } catch (err) {
        setAvailabilityError(
          err instanceof Error ? err.message : "Network error while checking availability.",
        );
        return;
      } finally {
        setCheckingAvailability(false);
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoChecking(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not validate that code.");
      setPromo(data.promo);
      setValue("promoCode", data.promo.code);
    } catch (err) {
      setPromo(null);
      setValue("promoCode", "");
      setPromoError(err instanceof Error ? err.message : "Could not validate that code.");
    } finally {
      setPromoChecking(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (submittedRef.current) return; // double-submit guard
    submittedRef.current = true;
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error ?? "We couldn't complete your booking. Please try again.");
      }
      router.push(
        `/booking/confirmation/${body.reference}?email=${encodeURIComponent(body.email)}`,
      );
    } catch (err) {
      submittedRef.current = false;
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Network error — your booking was not charged. Please try again.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  const inputRadioClasses =
    "size-4 border-stone-300 text-ocean-600 accent-ocean-600 focus:ring-ocean-500";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="min-w-0">
        {/* Progress */}
        <ol className="flex flex-wrap items-center gap-2" aria-label="Booking steps">
          {STEPS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium",
                    current && "bg-ocean-600 text-white",
                    done && "bg-ocean-50 text-ocean-800",
                    !current && !done && "bg-stone-100 text-stone-400",
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : `${i + 1}.`} {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="h-px w-4 bg-stone-200 sm:w-6" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>

        {submitError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <TriangleAlert className="mt-0.5 size-4.5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Booking failed</p>
              <p className="mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="mt-8">
          {/* ---- Step 1: Stay ---- */}
          <fieldset hidden={step !== 0}>
            <legend className="font-display text-2xl font-semibold text-stone-900">
              Choose your suite and dates
            </legend>

            <div className="mt-6 space-y-3" role="radiogroup" aria-label="Room">
              {rooms.map((r) => {
                const selected = roomId === r.id;
                const tooSmall = guestCount > r.max_guests;
                return (
                  <label
                    key={r.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-2xl border p-3 transition-all",
                      selected
                        ? "border-ocean-500 bg-ocean-50/50 ring-2 ring-ocean-200"
                        : "border-stone-200 bg-white hover:border-ocean-300",
                      tooSmall && "opacity-50",
                    )}
                  >
                    <input
                      type="radio"
                      value={r.id}
                      checked={selected}
                      disabled={tooSmall}
                      className="sr-only"
                      {...register("roomId")}
                    />
                    <Image
                      src={r.images[0] ?? "/images/property-exterior.jpg"}
                      alt=""
                      width={112}
                      height={84}
                      className="hidden aspect-[4/3] w-24 rounded-xl object-cover sm:block"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-stone-900">{r.name}</p>
                      <p className="mt-0.5 text-[13px] text-stone-500">
                        Sleeps {r.max_guests} · {r.bed_summary} · {r.room_size} m²
                        {tooSmall && (
                          <span className="ml-1 text-red-500">
                            (too small for {guestCount} guests)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ocean-800">
                        {formatPHP(r.price_per_night)}
                      </p>
                      <p className="text-xs text-stone-400">/ night</p>
                    </div>
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-ocean-600 bg-ocean-600" : "border-stone-300",
                      )}
                    >
                      {selected && <Check className="size-3 text-white" />}
                    </span>
                  </label>
                );
              })}
              {errors.roomId && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {errors.roomId.message}
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <InputField
                label="Check-in"
                type="date"
                min={today}
                required
                error={errors.checkIn?.message}
                {...register("checkIn")}
              />
              <InputField
                label="Check-out"
                type="date"
                min={checkIn || today}
                required
                error={errors.checkOut?.message}
                {...register("checkOut")}
              />
              <SelectField
                label="Guests"
                required
                error={errors.guestCount?.message}
                {...register("guestCount")}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </SelectField>
            </div>

            {availabilityError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-800"
              >
                <CalendarX2 className="mt-0.5 size-4 shrink-0" aria-hidden />
                {availabilityError}
              </div>
            )}
          </fieldset>

          {/* ---- Step 2: Guest info ---- */}
          <fieldset hidden={step !== 1}>
            <legend className="font-display text-2xl font-semibold text-stone-900">
              Who’s checking in?
            </legend>
            <div className="mt-6 space-y-5">
              <InputField
                label="Full name"
                autoComplete="name"
                required
                placeholder="As it appears on your ID"
                error={errors.guestName?.message}
                {...register("guestName")}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  required
                  hint="Your confirmation and reference number go here."
                  error={errors.guestEmail?.message}
                  {...register("guestEmail")}
                />
                <InputField
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+63 9xx xxx xxxx"
                  error={errors.guestPhone?.message}
                  {...register("guestPhone")}
                />
              </div>
              <SelectField
                label="Country"
                autoComplete="country-name"
                required
                error={errors.country?.message}
                {...register("country")}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectField>
              <TextareaField
                label="Special requests (optional)"
                placeholder="Airport transfer, crib, celebration, dietary needs…"
                hint="We'll do our best — requests aren't guaranteed but we always try."
                error={errors.specialRequests?.message}
                {...register("specialRequests")}
              />
            </div>
          </fieldset>

          {/* ---- Step 3: Review ---- */}
          <fieldset hidden={step !== 2}>
            <legend className="font-display text-2xl font-semibold text-stone-900">
              Review your stay
            </legend>
            {room && quote && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-stone-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-stone-900">{room.name}</p>
                      <p className="mt-1 text-sm text-stone-500">
                        {formatDate(checkIn)} → {formatDate(checkOut)} ·{" "}
                        {pluralize(nights, "night")} · {pluralize(Number(guestCount), "guest")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-sm font-medium text-ocean-700 underline-offset-4 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <PriceBreakdown quote={quote} className="mt-4 border-t border-stone-100 pt-3" />
                </div>

                <div>
                  <label
                    htmlFor="promo-input"
                    className="block text-sm font-medium text-stone-800"
                  >
                    Promo code (optional)
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="promo-input"
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10"
                      className="h-11 w-full max-w-56 rounded-xl border border-stone-300 bg-white px-3.5 text-[15px] uppercase text-stone-900 placeholder:normal-case placeholder:text-stone-400 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-200"
                    />
                    <Button
                      variant="secondary"
                      onClick={applyPromo}
                      loading={promoChecking}
                    >
                      <Tag className="size-4" aria-hidden />
                      Apply
                    </Button>
                  </div>
                  {promo && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-palm-700" role="status">
                      <BadgeCheck className="size-4" aria-hidden />
                      {promo.code} applied —{" "}
                      {promo.discount_type === "percent"
                        ? `${promo.discount_value}% off the room rate`
                        : `${formatPHP(promo.discount_value)} off`}
                      <button
                        type="button"
                        onClick={() => {
                          setPromo(null);
                          setPromoInput("");
                          setValue("promoCode", "");
                        }}
                        className="ml-1 text-stone-400 underline-offset-2 hover:underline"
                      >
                        Remove
                      </button>
                    </p>
                  )}
                  {promoError && (
                    <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                      {promoError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </fieldset>

          {/* ---- Step 4: Payment ---- */}
          <fieldset hidden={step !== 3}>
            <legend className="font-display text-2xl font-semibold text-stone-900">
              How would you like to pay?
            </legend>
            <div className="mt-6 space-y-3" role="radiogroup" aria-label="Payment method">
              {PAYMENT_METHODS.map((method) => {
                const selected = paymentMethod === method.key;
                return (
                  <label
                    key={method.key}
                    className={cn(
                      "flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all",
                      selected
                        ? "border-ocean-500 bg-ocean-50/50 ring-2 ring-ocean-200"
                        : "border-stone-200 bg-white hover:border-ocean-300",
                    )}
                  >
                    <input
                      type="radio"
                      value={method.key}
                      checked={selected}
                      className={cn(inputRadioClasses, "mt-1")}
                      {...register("paymentMethod")}
                    />
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-2 font-medium text-stone-900">
                        {method.label}
                        {method.note && (
                          <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-medium text-sand-800">
                            {method.note}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-stone-500">
                        {method.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {paymentMethod !== "pay_later" && (
              <p className="mt-4 rounded-xl bg-ocean-50 p-3.5 text-sm text-ocean-900">
                This demo stores your booking with payment{" "}
                <strong>pending</strong> — no charge happens. In production this
                is where Stripe, PayMongo, GCash, or Maya checkout takes over
                (integration points documented in the README).
              </p>
            )}
          </fieldset>

          {/* ---- Navigation ---- */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-stone-100 pt-6">
            {step > 0 ? (
              <Button variant="ghost" onClick={goBack} disabled={isSubmitting}>
                <ArrowLeft className="size-4" aria-hidden />
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={goNext} loading={checkingAvailability} size="lg">
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button type="submit" size="lg" variant="sunset" loading={isSubmitting}>
                {isSubmitting ? "Confirming your booking…" : "Confirm booking"}
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Sticky summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Booking summary">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-stone-900">
            Booking summary
          </h2>
          {room ? (
            <>
              <div className="mt-4 flex items-center gap-3.5">
                <Image
                  src={room.images[0] ?? "/images/property-exterior.jpg"}
                  alt={`${room.name} photo`}
                  width={96}
                  height={72}
                  className="aspect-[4/3] w-20 rounded-xl object-cover"
                />
                <div>
                  <p className="font-medium text-stone-900">{room.name}</p>
                  <p className="text-[13px] text-stone-500">
                    Sleeps {room.max_guests} · {room.bed_summary}
                  </p>
                </div>
              </div>
              {nights > 0 ? (
                <>
                  <dl className="mt-4 space-y-1 border-t border-stone-100 pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Check-in</dt>
                      <dd className="font-medium text-stone-800">{formatDate(checkIn)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Check-out</dt>
                      <dd className="font-medium text-stone-800">{formatDate(checkOut)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Guests</dt>
                      <dd className="font-medium text-stone-800">{guestCount}</dd>
                    </div>
                  </dl>
                  {quote && (
                    <PriceBreakdown
                      quote={quote}
                      className="mt-3 border-t border-stone-100 pt-3"
                    />
                  )}
                </>
              ) : (
                <p className="mt-4 border-t border-stone-100 pt-4 text-sm text-stone-500">
                  Pick your dates to see the full price breakdown.
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-stone-500">
              Choose a suite to start your booking.
            </p>
          )}
          <p className="mt-5 rounded-xl bg-sand-50 p-3 text-xs leading-relaxed text-stone-500">
            Free cancellation up to 7 days before check-in. No hidden charges —
            what you see is what you pay.
          </p>
        </div>
      </aside>
    </div>
  );
}
