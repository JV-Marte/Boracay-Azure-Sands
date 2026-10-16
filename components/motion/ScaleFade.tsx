"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Grows its content from 0.8 to full size as it scrolls into view, then dims
 * and fades it to 0.2 as it scrolls out. Static (full size, full opacity)
 * under reduced motion.
 */
export function ScaleFade({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current;
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0.8 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true },
          },
        );
        gsap.to(el, {
          opacity: 0.2,
          filter: "brightness(0.6)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "center top+=20%", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
