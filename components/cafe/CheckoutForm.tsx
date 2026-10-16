"use client";

import {
  ArrowRight,
  BedDouble,
  Bike,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cafe/CartProvider";
import { Button } from "@/components/ui/Button";
import { InputField, TextareaField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { CAFE, CAFE_PRICING, DELIVERY_AREA } from "@/lib/constants";
import { deliveryMinimumShortfall } from "@/lib/food-pricing";
import { cn, formatPHP } from "@/lib/utils";
import type { FulfillmentType } from "@/types";

const MODES: Array<{
  value: FulfillmentType;
  label: string;
  blurb: string;
  icon: typeof BedDouble;
  fee: string;
}> = [
  {
    value: "room_delivery",
    label: "Deliver to my room",
    blurb: "Billed to your stay at Azure Sands — nothing to pay at the door.",
    icon: BedDouble,
    fee: "+10% room service",
  },
  {
    value: "pickup",
    label: "Pick up at the counter",
    blurb: "Order ahead and collect at the lobby-level cafe.",
    icon: Store,
    fee: "No fee",
  },
  {
    value: "island_delivery",
    label: "Deliver on the island",
    blurb: `${DELIVERY_AREA}. Minimum ${formatPHP(CAFE_PRICING.deliveryMinimum)}.`,
    icon: Bike,
    fee: `+${formatPHP(CAFE_PRICING.deliveryFee)}`,
  },
];

export function CheckoutForm({ kitchenOpen }: { kitchenOpen: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const { resolved, subtotal, count, setQty, setNotes, remove, clear, totalsFor, hydrated } =
    useCart();

  const [mode, setMode] = useState<FulfillmentType>("room_delivery");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Room-charge fields
  const [bookingReference, setBookingReference] = useState("");
  const [email, setEmail] = useState("");
  const [roomNote, setRoomNote] = useState("");
  // Pickup + delivery fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setOrderNotes] = useState("");

  const totals = totalsFor(mode);
  const shortfall = deliveryMinimumShortfall(subtotal, mode);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-2xl bg-sand-100" />;
  }

  if (count === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-sand-100">
          <ShoppingBag className="size-6 text-stone-400" aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-xl font-medium text-ink-900">
          Your cart is empty
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
          Pick something from the menu and it will show up here.
        </p>
        <Link
          href="/cafe/menu"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  const validate = () => {
    const next: Record<string, string> = {};
    if (mode === "room_delivery") {
      if (bookingReference.trim().length < 6)
        next.bookingReference = "Enter your booking reference (e.g. ASB-7KQ2MX9C)";
      if (!/^\S+@\S+\.\S+$/.test(email.trim()))
        next.email = "Enter the email used for the booking";
    } else {
      if (customerName.trim().length < 2) next.customerName = "Please enter your name";
      if (customerPhone.replace(/\D/g, "").length < 7)
        next.customerPhone = "Enter a valid mobile number";
      if (mode === "island_delivery" && deliveryAddress.trim().length < 10)
        next.deliveryAddress = "Give us a street and barangay we can find";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!kitchenOpen) {
      toast(`The kitchen is closed. ${CAFE.hoursLabel}.`, "error");
      return;
    }
    if (shortfall !== null) {
      toast(
        `Delivery starts at ${formatPHP(CAFE_PRICING.deliveryMinimum)} — add ${formatPHP(shortfall)} more, or switch to pickup.`,
        "error",
      );
      return;
    }
    if (!validate()) return;

    const lines = resolved.map((l) => ({
      itemId: l.item.id,
      qty: l.qty,
      notes: l.notes ?? "",
    }));

    const payload =
      mode === "room_delivery"
        ? {
            fulfillmentType: mode,
            lines,
            notes,
            bookingReference: bookingReference.trim(),
            email: email.trim(),
            roomNote,
          }
        : mode === "pickup"
          ? {
              fulfillmentType: mode,
              lines,
              notes,
              customerName: customerName.trim(),
              customerPhone: customerPhone.trim(),
              pickupTime,
            }
          : {
              fulfillmentType: mode,
              lines,
              notes,
              customerName: customerName.trim(),
              customerPhone: customerPhone.trim(),
              deliveryAddress: deliveryAddress.trim(),
              landmark,
            };

    setSubmitting(true);
    try {
      const res = await fetch("/api/cafe/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not place your order.");
      clear();
      router.push(`/cafe/orders/${body.reference}`);
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : "Network error — please check your connection and try again.",
        "error",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="space-y-10">
        <section>
          <h2 className="font-display text-xl font-medium text-ink-900">
            How would you like it?
          </h2>
          <div className="mt-4 grid gap-3">
            {MODES.map((option) => {
              const active = option.value === mode;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors",
                    active
                      ? "border-sunset-500 bg-sunset-50/60 ring-1 ring-sunset-500"
                      : "border-stone-200 bg-white hover:border-stone-300",
                  )}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    value={option.value}
                    checked={active}
                    onChange={() => {
                      setMode(option.value);
                      setErrors({});
                    }}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl",
                      active ? "bg-sunset-500 text-white" : "bg-sand-100 text-stone-500",
                    )}
                  >
                    <option.icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-stone-900">{option.label}</span>
                      <span className="text-xs font-medium text-stone-500">{option.fee}</span>
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-stone-500">
                      {option.blurb}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-ink-900">
            {mode === "room_delivery" ? "Which stay is this for?" : "Your details"}
          </h2>

          {mode === "room_delivery" ? (
            <div className="mt-4 space-y-5">
              <p className="rounded-xl bg-ocean-50 px-4 py-3 text-sm leading-relaxed text-ocean-900">
                We check your booking before the kitchen starts. The order goes on your room bill
                and you settle it at check-out — nothing to pay the runner.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Booking reference"
                  placeholder="ASB-7KQ2MX9C"
                  required
                  value={bookingReference}
                  onChange={(e) => setBookingReference(e.target.value.toUpperCase())}
                  error={errors.bookingReference}
                />
                <InputField
                  label="Email on the booking"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
              </div>
              <InputField
                label="Anything the runner should know? (optional)"
                placeholder="Room 304 — please knock, the doorbell is broken"
                value={roomNote}
                onChange={(e) => setRoomNote(e.target.value)}
              />
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Your name"
                  autoComplete="name"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={errors.customerName}
                />
                <InputField
                  label="Mobile number"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+63 9XX XXX XXXX"
                  hint="We text you when the order is ready."
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  error={errors.customerPhone}
                />
              </div>

              {mode === "pickup" ? (
                <InputField
                  label="Pick-up time (optional)"
                  type="time"
                  hint="Leave blank and we start cooking straight away."
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              ) : (
                <>
                  <TextareaField
                    label="Delivery address"
                    rows={3}
                    placeholder="Resort or villa name, street, station — White Beach and Bulabag only"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    error={errors.deliveryAddress}
                  />
                  <InputField
                    label="Landmark (optional)"
                    placeholder="Grey gate beside the bakery"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </>
              )}
            </div>
          )}

          <div className="mt-5">
            <TextareaField
              label="Notes for the kitchen (optional)"
              rows={2}
              placeholder="No onions, extra rice, cutlery for two…"
              value={notes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card">
          <h2 className="font-display text-xl font-medium text-ink-900">Your order</h2>

          <ul className="mt-5 divide-y divide-stone-100">
            {resolved.map((line) => (
              <li key={line.item.id} className="py-4">
                <div className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={line.item.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-stone-900">{line.item.name}</p>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-stone-900">
                        {formatPHP(line.lineTotal)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-stone-300 p-0.5">
                        <button
                          type="button"
                          aria-label={`Remove one ${line.item.name}`}
                          onClick={() => setQty(line.item.id, line.qty - 1)}
                          className="grid size-6 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold tabular-nums">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Add one ${line.item.name}`}
                          onClick={() => setQty(line.item.id, line.qty + 1)}
                          className="grid size-6 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.item.id)}
                        className="grid size-7 place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${line.item.name} from the order`}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={line.notes ?? ""}
                      onChange={(e) => setNotes(line.item.id, e.target.value)}
                      placeholder="Add a note…"
                      aria-label={`Note for ${line.item.name}`}
                      className="mt-2 w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs text-stone-700 placeholder:text-stone-400 focus:border-sunset-400 focus:outline-none focus:ring-2 focus:ring-sunset-100"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between text-stone-600">
              <dt>Subtotal (VAT included)</dt>
              <dd className="tabular-nums">{formatPHP(totals.subtotal)}</dd>
            </div>
            {totals.roomServiceCharge > 0 && (
              <div className="flex justify-between text-stone-600">
                <dt>Room service (10%)</dt>
                <dd className="tabular-nums">{formatPHP(totals.roomServiceCharge)}</dd>
              </div>
            )}
            {totals.deliveryFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <dt>Island delivery</dt>
                <dd className="tabular-nums">{formatPHP(totals.deliveryFee)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-stone-200 pt-3 font-display text-lg font-medium text-ink-900">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPHP(totals.total)}</dd>
            </div>
          </dl>

          {shortfall !== null && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
            >
              Island delivery starts at {formatPHP(CAFE_PRICING.deliveryMinimum)}. Add{" "}
              {formatPHP(shortfall)} more, or switch to pickup.
            </p>
          )}

          {!kitchenOpen && (
            <p
              role="status"
              className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
            >
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
              The kitchen is closed. {CAFE.hoursLabel} — your cart will be waiting.
            </p>
          )}

          <Button
            type="button"
            size="lg"
            loading={submitting}
            disabled={!kitchenOpen || shortfall !== null}
            onClick={submit}
            className="mt-6 w-full bg-sunset-500 hover:bg-sunset-600 active:bg-sunset-700"
          >
            Place order
            <ArrowRight className="size-4" aria-hidden />
          </Button>

          <p className="mt-3 text-center text-xs leading-relaxed text-stone-500">
            {mode === "room_delivery"
              ? "Charged to your room and settled at check-out."
              : mode === "pickup"
                ? "Pay at the counter when you collect."
                : "Pay the rider in cash on delivery."}
          </p>

          <Link
            href="/cafe/menu"
            className="mt-4 block text-center text-sm font-medium text-stone-500 hover:text-stone-900"
          >
            Add something else
          </Link>
        </div>
      </aside>
    </div>
  );
}
