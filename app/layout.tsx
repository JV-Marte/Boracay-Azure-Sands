import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE } from "@/lib/constants";
import "./globals.css";

// Cabinet Grotesk (Fontshare, ITF Free Font License), self-hosted
const cabinet = localFont({
  variable: "--font-cabinet",
  display: "swap",
  src: [
    { path: "./fonts/CabinetGrotesk-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/CabinetGrotesk-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/CabinetGrotesk-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/CabinetGrotesk-800.woff2", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/images/boracay-hero.jpg", width: 1672, height: 941, alt: "White Beach, Boracay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/images/boracay-hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cabinet.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
