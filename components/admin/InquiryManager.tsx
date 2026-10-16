"use client";

import { ChevronDown, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminTable } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import type { Inquiry, InquiryStatus } from "@/types";

const STATUS_TONES = { new: "amber", in_progress: "ocean", resolved: "green" } as const;
const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
};

export function InquiryManager({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const setStatus = async (inquiry: Inquiry, status: InquiryStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Could not update the inquiry.");
      toast("Inquiry updated.", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed.", "error");
    }
  };

  if (inquiries.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Inbox zero"
        description="Messages from the contact form will land here."
      />
    );
  }

  return (
    <AdminTable
      caption="Contact inquiries"
      headers={["From", "Message", "Received", "Status", "Update"]}
    >
      {inquiries.map((inquiry) => (
        <tr key={inquiry.id} className="align-top hover:bg-sand-50/50">
          <td className="px-4 py-3">
            <p className="font-medium text-stone-900">{inquiry.name}</p>
            <a
              href={`mailto:${inquiry.email}`}
              className="text-xs text-ocean-700 hover:underline"
            >
              {inquiry.email}
            </a>
            {inquiry.phone && <p className="text-xs text-stone-400">{inquiry.phone}</p>}
          </td>
          <td className="max-w-md px-4 py-3 text-stone-600">
            <p className="whitespace-normal">{inquiry.message}</p>
          </td>
          <td className="px-4 py-3 text-stone-500">
            {formatDate(inquiry.created_at.slice(0, 10))}
          </td>
          <td className="px-4 py-3">
            <Badge tone={STATUS_TONES[inquiry.status]}>
              {STATUS_LABELS[inquiry.status]}
            </Badge>
          </td>
          <td className="px-4 py-3">
            <div className="relative w-fit">
              <label className="sr-only" htmlFor={`inq-${inquiry.id}`}>
                Update status for {inquiry.name}
              </label>
              <select
                id={`inq-${inquiry.id}`}
                value={inquiry.status}
                onChange={(e) => setStatus(inquiry, e.target.value as InquiryStatus)}
                className="h-9 appearance-none rounded-lg border border-stone-300 bg-white pl-3 pr-8 text-sm text-stone-800 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-200"
              >
                {(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((s) => (
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
      ))}
    </AdminTable>
  );
}
