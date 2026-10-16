"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GALLERY_CATEGORIES, GALLERY_IMAGES } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";

export function GalleryGrid() {
  const [category, setCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const images = useMemo(
    () =>
      category === "all"
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter((i) => i.category === category),
    [category],
  );

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length,
      ),
    [images.length],
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxIndex !== null && !dialog.open) dialog.showModal();
    if (lightboxIndex === null && dialog.open) dialog.close();
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prev, next]);

  const current = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Gallery categories"
        className="flex flex-wrap gap-2"
      >
        {GALLERY_CATEGORIES.map((cat) => {
          const active = category === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setCategory(cat.key);
                setLightboxIndex(null);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-ocean-600 text-white shadow-soft"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200",
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`Open image: ${image.alt}`}
              className="group block w-full overflow-hidden rounded-2xl"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={534}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        aria-label={current ? current.alt : "Image viewer"}
        className="m-auto w-[min(100vw-1rem,72rem)] bg-transparent p-0 backdrop:bg-ocean-950/90"
      >
        {current && (
          <figure className="relative">
            <Image
              src={current.src}
              alt={current.alt}
              width={1600}
              height={1067}
              sizes="90vw"
              className="max-h-[80svh] w-full rounded-xl object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {current.alt}{" "}
              <span className="text-white/50">
                · {(lightboxIndex ?? 0) + 1} / {images.length}
              </span>
            </figcaption>
            <button
              type="button"
              onClick={close}
              aria-label="Close image viewer"
              className="absolute -top-1 right-0 -translate-y-full rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
            >
              <X className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ocean-950/50 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-ocean-950/80"
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ocean-950/50 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-ocean-950/80"
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>
          </figure>
        )}
      </dialog>
    </div>
  );
}
