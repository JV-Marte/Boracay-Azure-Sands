import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";

const stayLinks = [
  { href: "/rooms", label: "Rooms & suites" },
  { href: "/booking", label: "Book a stay" },
  { href: "/manage-booking", label: "Manage booking" },
];

const exploreLinks = NAV_LINKS.filter((l) => l.href !== "/rooms");

export function Footer() {
  return (
    <footer className="grain ambient-lagoon overflow-hidden text-sand-100">
      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-24 sm:px-8 md:pt-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-md text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white">
              Suites that live like homes, run like a hotel.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="group mt-8 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-lg text-white transition-colors hover:border-ocean-300 hover:text-ocean-200"
            >
              {SITE.email}
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </div>

          <nav aria-label="Stay" className="md:col-span-2 md:col-start-7">
            <h2 className="text-sm font-medium text-white/40">Stay</h2>
            <ul className="mt-5 space-y-3">
              {stayLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-sand-100/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore" className="md:col-span-2">
            <h2 className="text-sm font-medium text-white/40">Explore</h2>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-sand-100/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="text-sm font-medium text-white/40">Front desk</h2>
            <ul className="mt-5 space-y-3 text-[15px] text-sand-100/80">
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {SITE.phone}
                </a>
              </li>
              <li>
                Check-in {SITE.checkInTime}
                <br />
                Check-out {SITE.checkOutTime}
              </li>
              <li className="text-sand-100/55">7 AM to 10 PM daily</li>
            </ul>
          </div>
        </div>

        <p className="mt-16 max-w-xl text-sm leading-relaxed text-sand-100/45">{SITE.address}</p>

        <p
          aria-hidden
          className="pointer-events-none mt-10 select-none whitespace-nowrap text-center text-[clamp(4rem,17.5vw,16rem)] font-bold leading-[0.78] tracking-[-0.06em] text-white/[0.06]"
        >
          Azure Sands
        </p>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-sm text-sand-100/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <p className="flex gap-6">
            <span>Stay 7+ nights, save 10%</span>
            <Link href="/admin" className="transition-colors hover:text-white">
              Staff login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
