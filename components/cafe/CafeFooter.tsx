import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CAFE, CAFE_NAV_LINKS } from "@/lib/constants";

export function CafeFooter() {
  return (
    <footer className="border-t border-sand-200 bg-sand-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo brand="cafe" tone="dark" className="h-11" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-600">
              {CAFE.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Order
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
              {CAFE_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-stone-900">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cafe/checkout" className="hover:text-stone-900">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Visit
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-600">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sunset-500" aria-hidden />
                <span>{CAFE.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-sunset-500" aria-hidden />
                <span>{CAFE.hoursLabel}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-sunset-500" aria-hidden />
                <a href={`tel:${CAFE.phone.replace(/\s/g, "")}`} className="hover:text-stone-900">
                  {CAFE.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-sunset-500" aria-hidden />
                <a href={`mailto:${CAFE.email}`} className="hover:text-stone-900">
                  {CAFE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-sand-200 pt-6 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {CAFE.name}. On the ground floor of Azure Sands Boracay.
          </p>
          <p>
            Also on property:{" "}
            <Link href="/" className="underline underline-offset-2 hover:text-stone-700">
              the condotel
            </Link>{" "}
            and{" "}
            <Link href="/gym" className="underline underline-offset-2 hover:text-stone-700">
              Azure Sands Fitness
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
