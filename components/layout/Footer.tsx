import { Clock, Mail, MapPin, Phone, TreePalm } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";

const exploreLinks = [
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/booking", label: "Book a stay" },
  { href: "/manage-booking", label: "Manage booking" },
  ...NAV_LINKS.filter((l) => l.href !== "/rooms").map((l) => ({ ...l })),
];

export function Footer() {
  return (
    <footer className="bg-ocean-950 text-ocean-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <p className="flex items-center gap-2 font-display text-lg font-semibold text-white">
              <TreePalm className="size-6 text-ocean-300" aria-hidden />
              Azure Sands
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ocean-200/80">
              A boutique condotel steps from White Beach — island suites with
              kitchens, a pool, and warm Filipino hospitality.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ocean-300/60">
              Boracay Island · Philippines
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ocean-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-ocean-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ocean-300" aria-hidden />
                <span>{SITE.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="size-4 shrink-0 text-ocean-300" aria-hidden />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-ocean-300" aria-hidden />
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Good to know
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-ocean-200/80">
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-ocean-300" aria-hidden />
                <span>
                  Check-in {SITE.checkInTime} · Check-out {SITE.checkOutTime}
                </span>
              </li>
              <li>{SITE.supportHours}</li>
              <li>Stay 7+ nights and save 10% automatically.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ocean-800/60 pt-6 text-xs text-ocean-300/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>
            <Link href="/admin" className="transition-colors hover:text-white">
              Staff login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
