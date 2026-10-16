"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { GYM, GYM_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Edge-to-edge split bar: logo hard left, links and the join action hard
 * right. Transparent over the landing hero, solid iron once you scroll or on
 * any inner page.
 */
export function GymNavbar() {
  const pathname = usePathname();
  const overlay = pathname === "/gym";
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

  const solid = !overlay || scrolled || menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500",
          solid ? "border-white/10 bg-iron-950/90 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Azure Sands Fitness"
          className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-5 sm:px-8"
        >
          <Link href="/gym" className="shrink-0">
            <Logo brand="fitness" tone="light" priority className="h-9 sm:h-10" />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <ul className="flex items-center gap-7">
              {GYM_NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-2 text-[15px] font-medium transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-ember-500 after:transition-transform after:duration-500",
                        active
                          ? "text-white after:scale-x-100"
                          : "text-white/60 after:scale-x-0 hover:text-white hover:after:scale-x-100",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/gym/join"
              className="group inline-flex h-11 items-center gap-1.5 rounded-full bg-ember-500 pl-5 pr-4 text-[15px] font-bold text-iron-950 transition-colors duration-300 hover:bg-ember-400"
            >
              Join now
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
            aria-controls="gym-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </nav>

        <div
          id="gym-mobile-menu"
          hidden={!menuOpen}
          className="h-[calc(100svh-5rem)] overflow-y-auto border-t border-white/10 bg-iron-950 lg:hidden"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
          }}
        >
          <ul className="px-5 pt-6">
            {GYM_NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-white/10">
                <Link
                  href={link.href}
                  className="block py-5 text-3xl font-bold tracking-[-0.03em] text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-4 p-5">
            <Link
              href="/gym/join"
              className="flex h-14 w-full items-center justify-center rounded-full bg-ember-500 text-base font-bold text-iron-950"
            >
              Join now
            </Link>
            <p className="text-center text-sm text-white/45">
              {GYM.phone} · {GYM.hoursLabel}
            </p>
          </div>
        </div>
      </header>
      {!overlay && <div className="h-20" aria-hidden />}
    </>
  );
}
