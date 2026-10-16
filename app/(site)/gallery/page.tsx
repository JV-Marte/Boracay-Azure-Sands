import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of Azure Sands Boracay Condotel — island suites, the pool, White Beach, dining spaces, and nearby attractions.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-8 md:pb-32">
      <div className="max-w-5xl">
        <h1 className="font-display text-[clamp(2.75rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink-900 text-balance">
          See the island life
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-500">
          Step inside our four suites — the beds you’ll sleep in, the balconies
          you’ll claim, and the views you’ll write home about.
        </p>
      </div>
      <div className="mt-10">
        <GalleryGrid />
      </div>
    </div>
  );
}
