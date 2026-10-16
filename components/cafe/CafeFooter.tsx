import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CAFE, CAFE_NAV_LINKS } from "@/lib/constants";

const alsoOnProperty = [
  { href: "/", label: "Azure Sands Boracay" },
  { href: "/gym", label: "Azure Sands Fitness" },
];

export function CafeFooter() {
  return (
    <footer className="overflow-hidden border-t border-espresso-900/10 bg-sand-100 text-espresso-700/80">
      <div className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 md:pt-32">
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Logo brand="cafe" tone="dark" className="h-10" />
            <p className="mt-10 max-w-md text-[clamp(1.625rem,2.4vw,2.125rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-espresso-900">
              Island comfort food, brought to your room.
            </p>
            <Link
              href="/cafe/menu"
              className="group mt-8 inline-flex items-center gap-2 border-b border-espresso-900/25 pb-1 text-lg font-medium text-espresso-900 transition-colors hover:border-sunset-600 hover:text-sunset-700"
            >
              Start an order
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>

          <nav aria-label="Order" className="lg:col-span-2 lg:col-start-7">
            <h2 className="text-sm font-medium text-espresso-700/50">Order</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {CAFE_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-espresso-900">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cafe/checkout" className="transition-colors hover:text-espresso-900">
                  Checkout
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-medium text-espresso-700/50">Visit</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>{CAFE.hoursLabel}</li>
              <li>
                <a href={`tel:${CAFE.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-espresso-900">
                  {CAFE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CAFE.email}`} className="break-all transition-colors hover:text-espresso-900">
                  {CAFE.email}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Also on property" className="lg:col-span-2">
            <h2 className="text-sm font-medium text-espresso-700/50">Also on property</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {alsoOnProperty.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-espresso-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-16 max-w-xl text-sm leading-relaxed text-espresso-700/55">{CAFE.address}</p>

        <p
          aria-hidden
          className="pointer-events-none mt-10 select-none whitespace-nowrap text-center text-[clamp(4rem,21vw,19rem)] font-semibold leading-[0.78] tracking-[-0.07em] text-espresso-900/[0.06]"
        >
          Cafe
        </p>

        <div className="border-t border-espresso-900/10 py-7 text-sm text-espresso-700/55">
          <p>
            © {new Date().getFullYear()} {CAFE.name}. On the ground floor of Azure Sands Boracay.
          </p>
        </div>
      </div>
    </footer>
  );
}
