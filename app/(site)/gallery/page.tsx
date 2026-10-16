import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of Azure Sands Boracay Condotel — island suites, the pool, White Beach, dining spaces, and nearby attractions.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ocean-600">
          Gallery
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          See the island life
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-500">
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
