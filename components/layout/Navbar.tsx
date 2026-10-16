"use client";

import { Menu, TreePalm, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  // The home page renders the navbar transparent over the hero until scroll.
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = !overlay || scrolled || menuOpen;

  return (
    <header
      className={cn(
        "z-50 transition-colors duration-300",
        overlay ? "fixed inset-x-0 top-0" : "sticky top-0",
        solid
          ? "border-b border-stone-200/70 bg-white/90 backdrop-blur-md shadow-soft"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-display text-lg font-semibold tracking-tight",
            solid ? "text-ocean-900" : "text-white",
          )}
        >
          <TreePalm
            className={cn("size-6", solid ? "text-ocean-600" : "text-white")}
            aria-hidden
          />
          <span>
            Azure Sands
            <span
              className={cn(
                "ml-2 hidden text-[11px] font-sans font-medium uppercase tracking-[0.22em] sm:inline",
                solid ? "text-stone-400" : "text-white/70",
              )}
            >
              Boracay
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  solid
                    ? active
                      ? "bg-ocean-50 text-ocean-800"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    : active
                      ? "bg-white/20 text-white"
                      : "text-white/85 hover:bg-white/15 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/manage-booking"
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              solid
                ? "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                : "text-white/85 hover:bg-white/15 hover:text-white",
            )}
          >
            Manage booking
          </Link>
          <div className="ml-2">
            <ButtonLink href="/booking" size="sm" variant={solid ? "primary" : "sunset"}>
              Book now
            </ButtonLink>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={cn(
            "rounded-full p-2 transition-colors md:hidden",
            solid
              ? "text-stone-700 hover:bg-stone-100"
              : "text-white hover:bg-white/15",
          )}
        >
          {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-stone-100 bg-white md:hidden"
        onClick={(e) => {
          // Close the menu when any link inside it is followed
          if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}
      >
        <div className="space-y-1 px-4 py-4">
          {[...NAV_LINKS, { href: "/manage-booking", label: "Manage booking" }].map(
            (link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-[15px] font-medium",
                    active
                      ? "bg-ocean-50 text-ocean-800"
                      : "text-stone-700 hover:bg-stone-50",
                  )}
                >
                  {link.label}
                </Link>
              );
            },
          )}
          <div className="pt-3">
            <ButtonLink href="/booking" className="w-full">
              Book now
            </ButtonLink>
          </div>
          <p className="px-4 pt-3 text-xs text-stone-400">{SITE.phone}</p>
        </div>
      </div>
    </header>
  );
}
