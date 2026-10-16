import type { Metadata } from "next";
import { CafeFooter } from "@/components/cafe/CafeFooter";
import { CafeNavbar } from "@/components/cafe/CafeNavbar";
import { CAFE } from "@/lib/constants";

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
    <>
      <a
        href="#cafe-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-stone-900 focus:shadow-card"
      >
        Skip to main content
      </a>
      <CafeNavbar />
      <main id="cafe-main" className="flex-1 bg-white">
        {children}
      </main>
      <CafeFooter />
    </>
  );
}
