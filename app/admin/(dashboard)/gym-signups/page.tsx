import Link from "next/link";
import { GymSignupManager } from "@/components/admin/GymSignupManager";
import { StatCard } from "@/components/admin/AdminTable";
import { listGymSignups } from "@/services/gym";

export const dynamic = "force-dynamic";

export default async function AdminGymSignupsPage() {
  const signups = await listGymSignups();
  const counts = {
    total: signups.length,
    new: signups.filter((s) => s.status === "new").length,
    enrolled: signups.filter((s) => s.status === "enrolled").length,
  };

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="font-display text-3xl font-medium text-ink-900">Gym sign-ups</h1>
      <p className="mt-1 text-sm text-stone-500">
        Membership requests from{" "}
        <Link href="/gym/join" className="text-ocean-700 hover:underline">
          Azure Sands Fitness
        </Link>
        . Call the new ones, then move them along the pipeline.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total sign-ups" value={String(counts.total)} />
        <StatCard label="Awaiting a call" value={String(counts.new)} hint="Status: new" />
        <StatCard label="Enrolled" value={String(counts.enrolled)} />
      </div>

      <div className="mt-8">
        <GymSignupManager signups={signups} />
      </div>
    </div>
  );
}
