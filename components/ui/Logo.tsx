import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoBrand = "main" | "fitness" | "cafe";
/** `dark` is the navy artwork for light backgrounds; `light` is the white one. */
export type LogoTone = "dark" | "light";

/** Intrinsic size of each lockup, so next/image can reserve the right box. */
const DIMENSIONS: Record<LogoBrand, { width: number; height: number }> = {
  main: { width: 661, height: 160 },
  fitness: { width: 662, height: 160 },
  cafe: { width: 661, height: 160 },
};

const LABELS: Record<LogoBrand, string> = {
  main: "Azure Sands Boracay",
  fitness: "Azure Sands Fitness",
  cafe: "Azure Sands Cafe",
};

/**
 * The full logo lockup — mark plus wordmark, as artwork rather than live text.
 * The brand name lives in the image, so `alt` carries it for screen readers and
 * gives the wrapping link its accessible name.
 *
 * Source files are public/images/brand/logo-<brand>[-light].png. The favicon is
 * generated from the mark alone (app/icon.png, app/apple-icon.png, favicon.ico).
 */
export function Logo({
  brand = "main",
  tone = "dark",
  className,
  priority,
  alt,
}: {
  brand?: LogoBrand;
  tone?: LogoTone;
  className?: string;
  priority?: boolean;
  /** Pass "" when an adjacent element already names the link. */
  alt?: string;
}) {
  const { width, height } = DIMENSIONS[brand];
  return (
    <Image
      src={`/images/brand/logo-${brand}${tone === "light" ? "-light" : ""}.png`}
      alt={alt ?? LABELS[brand]}
      width={width}
      height={height}
      priority={priority}
      // Height is the caller's to set. cn() is a plain join rather than
      // tailwind-merge, so a default h-* here would fight — and beat — whatever
      // the call site passes, depending only on Tailwind's output order.
      className={cn("w-auto", className)}
    />
  );
}
