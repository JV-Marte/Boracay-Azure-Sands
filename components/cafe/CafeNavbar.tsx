"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cafe/CartProvider";
import { Logo } from "@/components/ui/Logo";
import { CAFE, CAFE_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CafeNavbar() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-sand-50/95 backdrop-blur-md">
      <nav
        aria-label="Azure Sands Cafe"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link href="/cafe" className="shrink-0">
          <Logo brand="cafe" tone="dark" priority className="h-10" />
        </Link>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            {CAFE_NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sunset-50 text-sunset-700"
                      : "text-stone-600 hover:bg-sand-100 hover:text-stone-900",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/cafe/checkout"
            className="relative ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-stone-900 pl-4 pr-4 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
          >
            <ShoppingBag className="size-4" aria-hidden />
            <span className="hidden sm:inline">Cart</span>
            <span
              className={cn(
                "grid min-w-5 place-items-center rounded-full bg-sunset-500 px-1.5 text-[11px] font-bold tabular-nums",
                hydrated && count > 0 ? "" : "opacity-40",
              )}
            >
              {hydrated ? count : 0}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="cafe-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-full p-2 text-stone-700 transition-colors hover:bg-sand-100 md:hidden"
          >
            {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </nav>

      <div
        id="cafe-mobile-menu"
        hidden={!menuOpen}
        className="border-t border-sand-200 bg-white md:hidden"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}
      >
        <div className="space-y-1 px-4 py-4">
          {CAFE_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl px-4 py-3 text-[15px] font-medium text-stone-700 hover:bg-sand-50"
            >
              {link.label}
            </Link>
          ))}
          <p className="px-4 pt-3 text-xs text-stone-400">
            {CAFE.phone} · {CAFE.hoursLabel}
          </p>
        </div>
      </div>
    </header>
  );
}
