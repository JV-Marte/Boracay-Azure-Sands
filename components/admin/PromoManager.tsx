"use client";

import { Plus, Tags, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { InputField, SelectField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatPHP } from "@/lib/utils";
import type { PromoCode } from "@/types";

export function PromoManager({ promos }: { promos: PromoCode[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const year = new Date().getFullYear();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const usageLimit = String(data.get("usage_limit") ?? "").trim();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: data.get("code"),
          discount_type: data.get("discount_type"),
          discount_value: Number(data.get("discount_value")),
          valid_from: data.get("valid_from"),
          valid_until: data.get("valid_until"),
          usage_limit: usageLimit ? Number(usageLimit) : null,
          active: true,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not create the promo code.");
      toast("Promo code created.", "success");
      form.reset();
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not create the promo code.", "error");
    } finally {
      setSaving(false);
    }
  };

  const setActive = async (promo: PromoCode, active: boolean) => {
    try {
      const res = await fetch(`/api/admin/promo-codes/${promo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Could not update the promo code.");
      toast(`${promo.code} ${active ? "activated" : "deactivated"}.`, "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed.", "error");
    }
  };

  const remove = async (promo: PromoCode) => {
    try {
      const res = await fetch(`/api/admin/promo-codes/${promo.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete the promo code.");
      toast(`${promo.code} deleted.`, "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed.", "error");
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
      >
        <InputField
          label="Code"
          name="code"
          required
          placeholder="SUMMER25"
          className="uppercase"
          pattern="[A-Za-z0-9-]+"
        />
        <SelectField label="Type" name="discount_type">
          <option value="percent">Percent off</option>
          <option value="fixed">Fixed amount (PHP)</option>
        </SelectField>
        <InputField label="Value" name="discount_value" type="number" min={1} required />
        <InputField
          label="Valid from"
          name="valid_from"
          type="date"
          required
          defaultValue={`${year}-01-01`}
        />
        <InputField
          label="Valid until"
          name="valid_until"
          type="date"
          required
          defaultValue={`${year}-12-31`}
        />
        <InputField label="Usage limit" name="usage_limit" type="number" min={1} placeholder="∞" />
        <Button type="submit" loading={saving} className="sm:col-span-2 lg:col-span-1">
          <Plus className="size-4" aria-hidden />
          Create code
        </Button>
      </form>

      {promos.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No promo codes"
          description="Create a code above — guests apply it at the review step of booking."
        />
      ) : (
        <AdminTable
          caption="Promo codes"
          headers={["Code", "Discount", "Validity", "Usage", "Status", "Actions"]}
        >
          {promos.map((p) => (
            <tr key={p.id} className="hover:bg-sand-50/50">
              <td className="px-4 py-3 font-mono text-sm font-semibold text-stone-900">
                {p.code}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {p.discount_type === "percent"
                  ? `${p.discount_value}% off`
                  : `${formatPHP(p.discount_value)} off`}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {formatDate(p.valid_from)} → {formatDate(p.valid_until)}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {p.used_count}
                {p.usage_limit ? ` / ${p.usage_limit}` : " uses"}
              </td>
              <td className="px-4 py-3">
                <Badge tone={p.active ? "green" : "neutral"}>
                  {p.active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setActive(p, !p.active)}>
                    {p.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(p)}>
                    <Trash2 className="size-3.5 text-red-500" aria-hidden />
                    <span className="sr-only">Delete {p.code}</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
