"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Two stacked crescents: a wave over sand. Inherits currentColor. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M2.5 13.5c2.4-2.6 4.8-2.6 7.2 0s4.8 2.6 7.2 0 3.6-1.9 4.6-.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2.5 18.5c2.4-2.6 4.8-2.6 7.2 0s4.8 2.6 7.2 0 3.6-1.9 4.6-.9"
        stroke="currentColor"
        strokeOpacity=".45"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="6.5" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  // Pages with a full-bleed photo hero run under the floating nav; the rest get a spacer.
  const overlay = pathname === "/" || pathname === "/about";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = [...NAV_LINKS, { href: "/manage-booking", label: "Manage booking" }];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
        <nav
          aria-label="Main"
          className={cn(
            "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border pl-5 pr-2 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:h-16 sm:pl-6",
            scrolled || menuOpen || !overlay
              ? "border-white/10 bg-ink-950/80 shadow-lift"
              : "border-white/15 bg-ink-950/25",
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.02em] text-white"
          >
            <Mark className="size-6 text-ocean-300" />
            <span>
              Azure Sands
              <span className="ml-2 hidden font-medium text-white/45 sm:inline">Boracay</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300",
                      active ? "bg-white/12 text-white" : "text-white/65 hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-1.5 lg:flex">
            <Link
              href="/manage-booking"
              className="rounded-full px-4 py-2 text-[15px] font-medium text-white/65 transition-colors duration-300 hover:text-white"
            >
              Manage booking
            </Link>
            <Link
              href="/booking"
              className="group inline-flex h-11 items-center gap-1.5 rounded-full bg-ocean-300 pl-5 pr-4 text-[15px] font-medium text-ink-950 transition-colors duration-300 hover:bg-ocean-200 sm:h-12"
            >
              Book a stay
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          hidden={!menuOpen}
          className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          onClick={(e) => {
            // Close the menu when any link inside it is followed
            if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
          }}
        >
          <ul className="px-3 pt-4">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-2xl px-4 py-3.5 text-2xl font-medium tracking-[-0.02em]",
                      active ? "text-ocean-300" : "text-white/85 hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="space-y-4 p-5">
            <Link
              href="/booking"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ocean-300 text-base font-medium text-ink-950"
            >
              Book a stay
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <p className="text-center text-sm text-white/45">{SITE.phone}</p>
          </div>
        </div>
      </header>
      {!overlay && <div className="h-24 sm:h-32" aria-hidden />}
    </>
  );
}
