import { format, parseISO } from "date-fns";

/** Merge class names, filtering falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const phpFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export function formatPHP(amount: number) {
  return phpFormatter.format(amount);
}

/** "2026-08-14" -> "Aug 14, 2026" */
export function formatDate(isoDate: string) {
  return format(parseISO(isoDate), "MMM d, yyyy");
}

/** "2026-08-14" -> "Friday, August 14, 2026" */
export function formatDateLong(isoDate: string) {
  return format(parseISO(isoDate), "EEEE, MMMM d, yyyy");
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function pluralize(count: number, singular: string, plural?: string) {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}
