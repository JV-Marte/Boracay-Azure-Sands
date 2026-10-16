import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Review } from "@/types";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div
      className={className}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden
            className={
              i < rating
                ? "size-4 fill-sunset-400 text-sunset-400"
                : "size-4 text-stone-300"
            }
          />
        ))}
      </div>
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="flex h-full flex-col p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-stone-600">
        “{review.comment}”
      </blockquote>
      <footer className="mt-5 border-t border-stone-100 pt-4">
        <p className="text-sm font-semibold text-stone-900">{review.guest_name}</p>
        {review.stay_type && (
          <p className="mt-0.5 text-xs text-stone-400">{review.stay_type}</p>
        )}
      </footer>
    </Card>
  );
}
