import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { GYM, GYM_NAV_LINKS } from "@/lib/constants";

export function GymFooter() {
  return (
    <footer className="border-t border-white/10 bg-iron-950 text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo brand="fitness" tone="light" className="h-11" />
            <p className="mt-4 max-w-md text-sm leading-relaxed">{GYM.description}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {GYM_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gym/join" className="hover:text-white">
                  Join now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Visit
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                <span>{GYM.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                <span>{GYM.hoursLabel}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                <a href={`tel:${GYM.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {GYM.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-ember-400" aria-hidden />
                <a href={`mailto:${GYM.email}`} className="hover:text-white">
                  {GYM.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {GYM.name}. On the ground floor of Azure Sands Boracay.
          </p>
          <p>
            Also on property:{" "}
            <Link href="/" className="underline underline-offset-2 hover:text-white">
              the condotel
            </Link>{" "}
            and{" "}
            <Link href="/cafe" className="underline underline-offset-2 hover:text-white">
              Azure Sands Cafe
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
