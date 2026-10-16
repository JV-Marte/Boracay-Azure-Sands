"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { FoodOrderStatus, FulfillmentType } from "@/types";

const LABELS: Record<string, { title: string; body: string }> = {
  received: { title: "Order received", body: "The kitchen has your ticket." },
  preparing: { title: "Preparing", body: "Everything is being cooked to order." },
  ready: { title: "Ready", body: "Plated and packed." },
  out_for_delivery: { title: "On the way", body: "A runner is bringing it over." },
  completed: { title: "Delivered", body: "Enjoy — salamat!" },
};

function stepsFor(fulfillment: FulfillmentType): FoodOrderStatus[] {
  if (fulfillment === "pickup") return ["received", "preparing", "ready", "completed"];
  return ["received", "preparing", "ready", "out_for_delivery", "completed"];
}

export function OrderStatusTimeline({
  status,
  fulfillment,
}: {
  status: FoodOrderStatus;
  fulfillment: FulfillmentType;
}) {
  const router = useRouter();
  const done = status === "completed" || status === "cancelled";

  // Poll while the order is live so the guest sees the kitchen move it along.
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => router.refresh(), 20_000);
    return () => clearInterval(id);
  }, [done, router]);

  if (status === "cancelled") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
        <p className="font-medium text-red-900">This order was cancelled</p>
        <p className="mt-1 text-sm text-red-800">
          Call the cafe if that looks wrong — we can put it straight back on.
        </p>
      </div>
    );
  }

  const steps = stepsFor(fulfillment);
  const currentIndex = steps.indexOf(status);

  return (
    <ol className="space-y-1">
      {steps.map((step, index) => {
        // A completed order has no active step — every row is ticked.
        const complete = done || index < currentIndex;
        const current = !done && index === currentIndex;
        const label = step === "completed" && fulfillment === "pickup"
          ? { title: "Collected", body: "Enjoy — salamat!" }
          : LABELS[step];
        return (
          <li key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors",
                  complete
                    ? "border-sunset-500 bg-sunset-500 text-white"
                    : current
                      ? "border-sunset-500 bg-white text-sunset-600"
                      : "border-stone-200 bg-white text-stone-300",
                )}
              >
                {complete ? (
                  <Check className="size-4" aria-hidden />
                ) : current ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden />
                ) : (
                  <span className="size-2 rounded-full bg-current" />
                )}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "my-1 w-0.5 flex-1",
                    complete ? "bg-sunset-500" : "bg-stone-200",
                  )}
                />
              )}
            </div>
            <div className={cn("pb-6", index === steps.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "font-medium",
                  current ? "text-stone-900" : complete ? "text-stone-700" : "text-stone-400",
                )}
              >
                {label.title}
              </p>
              <p className="mt-0.5 text-sm text-stone-500">{label.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
