import type { Metadata } from "next";
import { GymFooter } from "@/components/gym/GymFooter";
import { GymNavbar } from "@/components/gym/GymNavbar";
import { GYM } from "@/lib/constants";

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
    <>
      <a
        href="#gym-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-iron-900 focus:shadow-card"
      >
        Skip to main content
      </a>
      <GymNavbar />
      <main id="gym-main" className="flex-1 bg-iron-950">
        {children}
      </main>
      <GymFooter />
    </>
  );
}
