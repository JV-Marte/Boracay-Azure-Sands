import { RoomCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function RoomsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-3 h-12 w-full max-w-lg" />
      <Skeleton className="mt-4 h-6 w-full max-w-xl" />
      <Skeleton className="mt-10 h-28 w-full rounded-2xl" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }, (_, i) => (
          <RoomCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
