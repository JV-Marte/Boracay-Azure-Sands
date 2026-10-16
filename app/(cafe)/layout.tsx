import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { CSSProperties } from "react";
import { CafeFooter } from "@/components/cafe/CafeFooter";
import { CafeNavbar } from "@/components/cafe/CafeNavbar";
import { CAFE } from "@/lib/constants";

// Geist, scoped to the cafe so it reads as its own brand next to the condotel
// (Cabinet Grotesk) and the gym (Satoshi).
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });

const fontScope = {
  "--font-sans": "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
  "--font-display": "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
} as CSSProperties;

export const metadata: Metadata = {
  title: {
    default: `${CAFE.name} — ${CAFE.tagline}`,
    template: `%s · ${CAFE.shortName}`,
  },
  description: CAFE.description,
  openGraph: {
    type: "website",
    siteName: CAFE.name,
    title: `${CAFE.name} — ${CAFE.tagline}`,
    description: CAFE.description,
    images: [{ url: "/images/cafe/hero.jpg", width: 1536, height: 1024, alt: CAFE.name }],
  },
};

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${geist.variable} flex flex-1 flex-col bg-sand-50 font-sans text-espresso-700`}
      style={fontScope}
    >
      <a
        href="#cafe-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-espresso-900 focus:shadow-card"
      >
        Skip to main content
      </a>
      <CafeNavbar />
      <main id="cafe-main" className="w-full max-w-full flex-1 overflow-x-clip">
        {children}
      </main>
      <CafeFooter />
    </div>
  );
}
