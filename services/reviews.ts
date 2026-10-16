import { getMemoryStore } from "@/lib/data/memory-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { ServiceError } from "@/services/errors";
import type { Review } from "@/types";

export async function listApprovedReviews(limit = 6): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new ServiceError("Could not load reviews.", 500);
    return data as Review[];
  }
  return getMemoryStore()
    .reviews.filter((r) => r.approved)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit);
}

export async function listAllReviews(): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new ServiceError("Could not load reviews.", 500);
    return data as Review[];
  }
  return [...getMemoryStore().reviews].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}

export async function setReviewApproval(id: string, approved: boolean): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from("reviews").update({ approved }).eq("id", id);
    if (error) throw new ServiceError("Could not update the review.", 500);
    return;
  }
  const review = getMemoryStore().reviews.find((r) => r.id === id);
  if (!review) throw new ServiceError("Review not found.", 404);
  review.approved = approved;
}

export async function deleteReview(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from("reviews").delete().eq("id", id);
    if (error) throw new ServiceError("Could not delete the review.", 500);
    return;
  }
  const store = getMemoryStore();
  const index = store.reviews.findIndex((r) => r.id === id);
  if (index === -1) throw new ServiceError("Review not found.", 404);
  store.reviews.splice(index, 1);
}
