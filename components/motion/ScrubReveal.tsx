"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * A paragraph whose words light up one by one as it scrolls through the viewport.
 * Words render at full opacity in the markup; dimming happens only when motion is allowed.
 */
export function ScrubReveal({
  text,
  accent,
  className,
  accentClassName = "text-ocean-300",
}: {
  text: string;
  accent?: string[];
  /** Replaces the default type styling (size, colour, width). */
  className?: string;
  accentClassName?: string;
}) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const accented = new Set(accent);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: root.current,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <p
      ref={root}
      className={
        className ??
        "mx-auto max-w-6xl text-[clamp(1.875rem,4.2vw,3.75rem)] font-medium leading-[1.12] tracking-[-0.035em] text-sand-50"
      }
    >
      {words.map((word, i) => (
        <span
          key={i}
          data-word
          className={cn(accented.has(word.replace(/[.,]/g, "")) && accentClassName)}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
