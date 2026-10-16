"use client";

import {
  BedDouble,
  CalendarRange,
  ChefHat,
  Dumbbell,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Star,
  Tags,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarRange },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/blocked-dates", label: "Blocked dates", icon: X },
  { href: "/admin/promo-codes", label: "Promo codes", icon: Tags },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

/** The add-on modules that share this dashboard. */
const moduleLinks = [
  { href: "/admin/orders", label: "Kitchen board", icon: ChefHat },
  { href: "/admin/gym-signups", label: "Gym sign-ups", icon: Dumbbell },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-ocean-800 text-white"
                : "text-ocean-200/80 hover:bg-ocean-900 hover:text-white",
            )}
          >
            <link.icon className="size-4.5 shrink-0" aria-hidden />
            {link.label}
          </Link>
        );
      })}
      <p className="mt-4 px-3.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ocean-400/70">
        Modules
      </p>
      {moduleLinks.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-ocean-800 text-white"
                : "text-ocean-200/80 hover:bg-ocean-900 hover:text-white",
            )}
          >
            <link.icon className="size-4.5 shrink-0" aria-hidden />
            {link.label}
          </Link>
        );
      })}
      <div className="mt-auto space-y-1 border-t border-ocean-800/60 pt-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ocean-200/80 transition-colors hover:bg-ocean-900 hover:text-white"
        >
          <MessageSquareText className="size-4.5 shrink-0" aria-hidden />
          View site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ocean-200/80 transition-colors hover:bg-ocean-900 hover:text-white"
        >
          <LogOut className="size-4.5 shrink-0" aria-hidden />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-ocean-950 px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo brand="main" tone="light" className="h-7" />
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ocean-400">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          className="rounded-lg p-2 text-white hover:bg-ocean-900"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-1 bg-ocean-950 px-4 pb-4 lg:hidden">{nav}</div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col bg-ocean-950 p-4 lg:flex">
        <Link href="/admin" className="mb-6 block px-2">
          <Logo brand="main" tone="light" className="h-8" />
          <span className="mt-1.5 block text-[11px] font-medium uppercase tracking-[0.2em] text-ocean-400">
            Admin
          </span>
        </Link>
        {nav}
      </aside>
    </>
  );
}
