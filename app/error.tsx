"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled app error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
        <TriangleAlert className="size-7 text-red-600" aria-hidden />
      </div>
      <h1 className="mt-6 font-display text-3xl font-medium tracking-[-0.03em] text-ink-900">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-stone-500">
        An unexpected error interrupted the page. Your booking data is safe —
        try again, and contact us if it keeps happening.
      </p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}
