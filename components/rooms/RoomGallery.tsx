"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  if (count === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${roomName} — photo ${index + 1} of ${count}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover animate-fade-in"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-stone-700 shadow-soft backdrop-blur-sm transition-colors hover:bg-white"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-stone-700 shadow-soft backdrop-blur-sm transition-colors hover:bg-white"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-ocean-950/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {index + 1} / {count}
            </p>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Photos">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg transition-opacity",
                i === index
                  ? "ring-2 ring-ocean-600 ring-offset-2"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
