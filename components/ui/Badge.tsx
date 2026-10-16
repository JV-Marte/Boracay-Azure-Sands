import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "ocean"
  | "palm"
  | "sunset"
  | "sand"
  | "green"
  | "amber"
  | "red";

const tones: Record<Tone, string> = {
  neutral: "bg-stone-100 text-stone-700",
  ocean: "bg-ocean-50 text-ocean-800",
  palm: "bg-palm-50 text-palm-700",
  sunset: "bg-sunset-50 text-sunset-700",
  sand: "bg-sand-100 text-sand-800",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function bookingStatusTone(status: string): Tone {
  switch (status) {
    case "confirmed":
      return "green";
    case "pending":
      return "amber";
    case "cancelled":
      return "red";
    case "completed":
      return "ocean";
    default:
      return "neutral";
  }
}

export function paymentStatusTone(status: string): Tone {
  switch (status) {
    case "paid":
      return "green";
    case "pending":
      return "amber";
    case "refunded":
      return "ocean";
    case "failed":
      return "red";
    default:
      return "neutral";
  }
}
