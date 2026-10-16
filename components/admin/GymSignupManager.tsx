"use client";

import { ChevronDown, Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminTable } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { getGymPlan } from "@/lib/data/gym";
import { formatDate, formatDateLong } from "@/lib/utils";
import type { GymSignup, GymSignupStatus } from "@/types";

const STATUS_TONES = {
  new: "amber",
  contacted: "ocean",
  enrolled: "green",
  declined: "red",
} as const;

const STATUS_LABELS: Record<GymSignupStatus, string> = {
  new: "New",
  contacted: "Contacted",
  enrolled: "Enrolled",
  declined: "Declined",
};

export function GymSignupManager({ signups }: { signups: GymSignup[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const setStatus = async (signup: GymSignup, status: GymSignupStatus) => {
    try {
      const res = await fetch(`/api/admin/gym-signups/${signup.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Could not update the sign-up.");
      toast("Sign-up updated.", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed.", "error");
    }
  };

  if (signups.length === 0) {
    return (
      <EmptyState
        icon={Dumbbell}
        title="No sign-ups yet"
        description="Membership forms submitted at /gym/join will land here."
      />
    );
  }

  return (
    <AdminTable
      caption="Gym membership sign-ups"
      headers={["Reference", "Person", "Membership", "Start", "Goal", "Received", "Status", "Update"]}
    >
      {signups.map((signup) => {
        const plan = getGymPlan(signup.plan_id);
        return (
          <tr key={signup.id} className="align-top hover:bg-sand-50/50">
            <td className="px-4 py-3 font-mono text-xs text-stone-700">{signup.reference}</td>
            <td className="px-4 py-3">
              <p className="font-medium text-stone-900">{signup.full_name}</p>
              <a
                href={`mailto:${signup.email}`}
                className="text-xs text-ocean-700 hover:underline"
              >
                {signup.email}
              </a>
              <p className="text-xs text-stone-400">{signup.phone}</p>
              {signup.is_hotel_guest && (
                <Badge tone="sand" className="mt-1.5">
                  Hotel guest
                </Badge>
              )}
            </td>
            <td className="px-4 py-3 text-stone-600">{plan?.name ?? signup.plan_id}</td>
            <td className="px-4 py-3 text-stone-600">
              {formatDateLong(signup.preferred_start)}
            </td>
            <td className="max-w-xs px-4 py-3 text-stone-600">
              <p className="whitespace-normal">{signup.goal ?? "—"}</p>
            </td>
            <td className="px-4 py-3 text-stone-500">
              {formatDate(signup.created_at.slice(0, 10))}
            </td>
            <td className="px-4 py-3">
              <Badge tone={STATUS_TONES[signup.status]}>{STATUS_LABELS[signup.status]}</Badge>
            </td>
            <td className="px-4 py-3">
              <div className="relative w-fit">
                <label className="sr-only" htmlFor={`gym-${signup.id}`}>
                  Update status for {signup.full_name}
                </label>
                <select
                  id={`gym-${signup.id}`}
                  value={signup.status}
                  onChange={(e) => setStatus(signup, e.target.value as GymSignupStatus)}
                  className="h-9 appearance-none rounded-lg border border-stone-300 bg-white pl-3 pr-8 text-sm text-stone-800 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-200"
                >
                  {(Object.keys(STATUS_LABELS) as GymSignupStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                  aria-hidden
                />
              </div>
            </td>
          </tr>
        );
      })}
    </AdminTable>
  );
}
