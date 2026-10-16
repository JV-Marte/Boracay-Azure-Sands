"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { GYM, GYM_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function GymNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-iron-950/95 backdrop-blur-md">
      <nav
        aria-label="Azure Sands Fitness"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link href="/gym" className="shrink-0">
          <Logo brand="fitness" tone="light" priority className="h-10" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {GYM_NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/70 hover:bg-white/8 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/gym/join"
            className="ml-2 inline-flex h-9 items-center justify-center rounded-full bg-ember-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-ember-600"
          >
            Join now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="gym-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-full p-2 text-white transition-colors hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </nav>

      <div
        id="gym-mobile-menu"
        hidden={!menuOpen}
        className="border-t border-white/10 bg-iron-950 md:hidden"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}
      >
        <div className="space-y-1 px-4 py-4">
          {GYM_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl px-4 py-3 text-[15px] font-medium text-white/80 hover:bg-white/8 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <Link
              href="/gym/join"
              className="flex h-11 w-full items-center justify-center rounded-full bg-ember-500 text-sm font-semibold text-white"
            >
              Join now
            </Link>
          </div>
          <p className="px-4 pt-3 text-xs text-white/40">{GYM.phone}</p>
        </div>
      </div>
    </header>
  );
}
