"use client";

import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { InputField, SelectField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { CalendarX2 } from "lucide-react";
import type { BlockedDate, Room } from "@/types";

interface BlockedDatesManagerProps {
  blocks: BlockedDate[];
  rooms: Room[];
}

export function BlockedDatesManager({ blocks, rooms }: BlockedDatesManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const today = format(new Date(), "yyyy-MM-dd");
  const [saving, setSaving] = useState(false);
  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? "—";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: data.get("roomId"),
          startDate: data.get("startDate"),
          endDate: data.get("endDate"),
          reason: data.get("reason") || "",
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not block those dates.");
      toast("Dates blocked.", "success");
      form.reset();
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not block those dates.", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not remove the block.");
      toast("Block removed — dates are bookable again.", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not remove the block.", "error");
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_1fr_auto] lg:items-end"
      >
        <SelectField label="Room" name="roomId" required>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </SelectField>
        <InputField label="First blocked night" name="startDate" type="date" min={today} required />
        <InputField
          label="End date (exclusive)"
          name="endDate"
          type="date"
          min={today}
          required
          hint="Bookable again from this date."
        />
        <InputField label="Reason (optional)" name="reason" placeholder="Maintenance, owner stay…" />
        <Button type="submit" loading={saving} className="lg:mb-6">
          <Plus className="size-4" aria-hidden />
          Block dates
        </Button>
      </form>

      {blocks.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title="No blocked dates"
          description="Block dates for maintenance or owner use — guests won't be able to book them."
        />
      ) : (
        <AdminTable
          caption="Blocked date ranges"
          headers={["Room", "From", "Until (exclusive)", "Reason", "Actions"]}
        >
          {blocks.map((b) => (
            <tr key={b.id} className="hover:bg-sand-50/50">
              <td className="px-4 py-3 font-medium text-stone-900">{roomName(b.room_id)}</td>
              <td className="px-4 py-3 text-stone-600">{formatDate(b.start_date)}</td>
              <td className="px-4 py-3 text-stone-600">{formatDate(b.end_date)}</td>
              <td className="px-4 py-3 text-stone-600">{b.reason || "—"}</td>
              <td className="px-4 py-3">
                <Button size="sm" variant="ghost" onClick={() => remove(b.id)}>
                  <Trash2 className="size-3.5 text-red-500" aria-hidden />
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
