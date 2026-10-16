import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { GYM, GYM_NAV_LINKS } from "@/lib/constants";

const alsoOnProperty = [
  { href: "/", label: "Azure Sands Boracay" },
  { href: "/cafe", label: "Azure Sands Cafe" },
];

export function GymFooter() {
  return (
    <footer className="overflow-hidden border-t border-white/10 bg-iron-950 text-white/65">
      <div className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 md:pt-32">
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Logo brand="fitness" tone="light" className="h-10" />
            <p className="mt-10 max-w-md text-[clamp(1.625rem,2.4vw,2.125rem)] font-black leading-[1.05] tracking-[-0.04em] text-white">
              Train where you stay.
            </p>
            <Link
              href="/gym/join"
              className="group mt-8 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-lg font-medium text-white transition-colors hover:border-ember-400 hover:text-ember-300"
            >
              Start a membership
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>

          <nav aria-label="Gym" className="lg:col-span-2 lg:col-start-7">
            <h2 className="text-sm font-medium text-white/40">The gym</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {GYM_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gym/join" className="transition-colors hover:text-white">
                  Join now
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-medium text-white/40">Visit</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>{GYM.hoursLabel}</li>
              <li>
                <a href={`tel:${GYM.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-white">
                  {GYM.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${GYM.email}`} className="break-all transition-colors hover:text-white">
                  {GYM.email}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Also on property" className="lg:col-span-2">
            <h2 className="text-sm font-medium text-white/40">Also on property</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {alsoOnProperty.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-16 max-w-xl text-sm leading-relaxed text-white/40">{GYM.address}</p>

        <p
          aria-hidden
          className="pointer-events-none mt-10 select-none whitespace-nowrap text-center text-[clamp(4rem,19vw,17rem)] font-black leading-[0.78] tracking-[-0.07em] text-white/[0.05]"
        >
          FITNESS
        </p>

        <div className="border-t border-white/10 py-7 text-sm text-white/40">
          <p>
            © {new Date().getFullYear()} {GYM.name}. On the ground floor of Azure Sands Boracay.
          </p>
        </div>
      </div>
    </footer>
  );
}
