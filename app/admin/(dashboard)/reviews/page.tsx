import { ReviewManager } from "@/components/admin/ReviewManager";
import { listAllReviews } from "@/services/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await listAllReviews();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold text-stone-900">Reviews</h1>
      <p className="mt-1 text-sm text-stone-500">
        Only approved reviews appear on the website. Keep them honest — mixed
        ratings build more trust than a wall of five stars.
      </p>
      <div className="mt-8">
        <ReviewManager reviews={reviews} />
      </div>
    </div>
  );
}
