"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cafe/CartProvider";
import { Logo } from "@/components/ui/Logo";
import { CAFE, CAFE_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Split nav with the logo centred, like a menu card: links on the left, the
 * cart on the right.
 */
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
    <header className="sticky top-0 z-50 border-b border-espresso-900/10 bg-sand-50/90 backdrop-blur-xl">
      <nav
        aria-label="Azure Sands Cafe"
        className="mx-auto grid h-20 max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8"
      >
        <ul className="hidden items-center gap-7 md:flex">
          {CAFE_NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-[15px] font-medium transition-colors duration-300",
                    active
                      ? "text-espresso-900 underline decoration-sunset-500 decoration-2 underline-offset-[10px]"
                      : "text-espresso-700/70 hover:text-espresso-900",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="cafe-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex size-11 items-center justify-center justify-self-start rounded-full border border-espresso-900/15 text-espresso-900 transition-colors hover:bg-sand-100 md:hidden"
        >
          {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>

        <Link href="/cafe" className="justify-self-center">
          <Logo brand="cafe" tone="dark" priority className="h-9 sm:h-10" />
        </Link>

        <div className="flex items-center justify-self-end gap-5">
          <a
            href={`tel:${CAFE.phone.replace(/\s/g, "")}`}
            className="hidden text-[15px] font-medium text-espresso-700/70 transition-colors hover:text-espresso-900 lg:inline"
          >
            {CAFE.phone}
          </a>
          <Link
            href="/cafe/checkout"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-espresso-900 pl-4 pr-2 text-[15px] font-medium text-sand-50 transition-colors duration-300 hover:bg-espresso-800"
          >
            <ShoppingBag className="size-4" aria-hidden />
            <span className="hidden sm:inline">Cart</span>
            <span
              className={cn(
                "grid h-7 min-w-7 place-items-center rounded-full px-2 text-xs font-semibold tabular-nums",
                hydrated && count > 0 ? "bg-sunset-500 text-espresso-950" : "bg-sand-50/15 text-sand-50/70",
              )}
            >
              <span className="sr-only">Items in cart: </span>
              {hydrated ? count : 0}
            </span>
          </Link>
        </div>
      </nav>

      <div
        id="cafe-mobile-menu"
        hidden={!menuOpen}
        className="h-[calc(100svh-5rem)] border-t border-espresso-900/10 bg-sand-50 md:hidden"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}
      >
        <ul className="px-5 pt-6">
          {CAFE_NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-espresso-900/10">
              <Link
                href={link.href}
                className="block py-5 text-3xl font-semibold tracking-[-0.04em] text-espresso-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="px-5 pt-6 text-sm text-espresso-700/60">
          {CAFE.phone} · {CAFE.hoursLabel}
        </p>
      </div>
    </header>
  );
}
