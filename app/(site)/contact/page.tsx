import type { Metadata } from "next";
import { Clock, DoorOpen, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Card } from "@/components/ui/Card";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Azure Sands Boracay Condotel — questions, transfers, group bookings, and special requests. We reply within hours.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-8 md:pb-32">
      <div className="max-w-5xl">
        <h1 className="font-display text-[clamp(2.75rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink-900 text-balance">
          Talk to a human on the island
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-500">
          Transfers, group stays, celebrations, or just picking the right suite
          — send us a note and we’ll sort it out.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-6 sm:p-8">
          <h2 className="font-display text-xl font-medium text-ink-900">
            Send us a message
          </h2>
          <p className="mt-1 mb-6 text-sm text-stone-500">
            We usually reply within a few hours during front desk time.
          </p>
          <ContactForm />
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-lg font-medium text-ink-900">
              Reach us directly
            </h2>
            <ul className="mt-4 space-y-4 text-[15px]">
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-stone-700 transition-colors hover:text-ocean-700"
                >
                  <Phone className="size-4.5 shrink-0 text-ocean-600" aria-hidden />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 text-stone-700 transition-colors hover:text-ocean-700"
                >
                  <Mail className="size-4.5 shrink-0 text-ocean-600" aria-hidden />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-stone-700 transition-colors hover:text-ocean-700"
                >
                  <MessageCircle className="size-4.5 shrink-0 text-palm-600" aria-hidden />
                  WhatsApp / Viber
                </a>
              </li>
              <li className="flex items-start gap-3 text-stone-700">
                <MapPin className="mt-1 size-4.5 shrink-0 text-ocean-600" aria-hidden />
                <span>{SITE.address}</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg font-medium text-ink-900">
              Hours & timing
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] text-stone-700">
              <li className="flex items-center gap-3">
                <DoorOpen className="size-4.5 shrink-0 text-ocean-600" aria-hidden />
                Check-in {SITE.checkInTime} · Check-out {SITE.checkOutTime}
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4.5 shrink-0 text-ocean-600" aria-hidden />
                {SITE.supportHours}
              </li>
            </ul>
          </Card>

          <div className="overflow-hidden rounded-2xl shadow-soft">
            <iframe
              src={SITE.mapsEmbedUrl}
              title="Map showing the location of Azure Sands Boracay Condotel"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
