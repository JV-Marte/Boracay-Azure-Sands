import type { Metadata } from "next";
import localFont from "next/font/local";
import type { CSSProperties } from "react";
import { GymFooter } from "@/components/gym/GymFooter";
import { GymNavbar } from "@/components/gym/GymNavbar";
import { GYM } from "@/lib/constants";

// Satoshi (Fontshare, ITF Free Font License), self-hosted. Scoped to the gym so
// the fitness brand reads differently from the condotel and the cafe.
const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    { path: "../fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Satoshi-900.woff2", weight: "900", style: "normal" },
  ],
});

const fontScope = {
  "--font-sans": "var(--font-satoshi), ui-sans-serif, system-ui, sans-serif",
  "--font-display": "var(--font-satoshi), ui-sans-serif, system-ui, sans-serif",
} as CSSProperties;

export const metadata: Metadata = {
  title: {
    default: `${GYM.name} — ${GYM.tagline}`,
    template: `%s · ${GYM.shortName}`,
  },
  description: GYM.description,
  openGraph: {
    type: "website",
    siteName: GYM.name,
    title: `${GYM.name} — ${GYM.tagline}`,
    description: GYM.description,
    images: [{ url: "/images/gym/hero.jpg", width: 1536, height: 1024, alt: GYM.name }],
  },
};

export default function GymLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${satoshi.variable} flex flex-1 flex-col bg-iron-950 font-sans text-white/70`}
      style={fontScope}
    >
      <a
        href="#gym-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-iron-900 focus:shadow-card"
      >
        Skip to main content
      </a>
      <GymNavbar />
      <main id="gym-main" className="w-full max-w-full flex-1 overflow-x-clip">
        {children}
      </main>
      <GymFooter />
    </div>
  );
}
