"use client";

import { Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminTable } from "@/components/admin/AdminTable";
import { Stars } from "@/components/reviews/ReviewCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export function ReviewManager({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const setApproval = async (review: Review, approved: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error("Could not update the review.");
      toast(approved ? "Review published." : "Review hidden.", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed.", "error");
    }
  };

  const remove = async (review: Review) => {
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete the review.");
      toast("Review deleted.", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed.", "error");
    }
  };

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No reviews yet"
        description="Guest reviews you add or collect will appear here for approval before going live."
      />
    );
  }

  return (
    <AdminTable
      caption="Guest reviews"
      headers={["Guest", "Rating", "Comment", "Date", "Status", "Actions"]}
    >
      {reviews.map((review) => (
        <tr key={review.id} className="align-top hover:bg-sand-50/50">
          <td className="px-4 py-3">
            <p className="font-medium text-stone-900">{review.guest_name}</p>
            {review.stay_type && (
              <p className="text-xs text-stone-400">{review.stay_type}</p>
            )}
          </td>
          <td className="px-4 py-3">
            <Stars rating={review.rating} />
          </td>
          <td className="max-w-md px-4 py-3 text-stone-600">
            <p className="line-clamp-3 whitespace-normal">{review.comment}</p>
          </td>
          <td className="px-4 py-3 text-stone-500">
            {formatDate(review.created_at.slice(0, 10))}
          </td>
          <td className="px-4 py-3">
            <Badge tone={review.approved ? "green" : "amber"}>
              {review.approved ? "Published" : "Pending"}
            </Badge>
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={review.approved ? "outline" : "primary"}
                onClick={() => setApproval(review, !review.approved)}
              >
                {review.approved ? "Hide" : "Approve"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(review)}>
                <Trash2 className="size-3.5 text-red-500" aria-hidden />
                <span className="sr-only">Delete review by {review.guest_name}</span>
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </AdminTable>
  );
}
