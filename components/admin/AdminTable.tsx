import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
  caption?: string;
}

/** Shared table shell: horizontal scroll on small screens, consistent styling. */
export function AdminTable({ headers, children, className, caption }: AdminTableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-soft",
        className,
      )}
    >
      <table className="w-full min-w-max text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-stone-200 bg-sand-50/60">
            {headers.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">{children}</tbody>
      </table>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-stone-500">{label}</p>
        {icon}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-stone-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
