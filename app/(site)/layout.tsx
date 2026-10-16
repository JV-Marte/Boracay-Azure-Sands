import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-900 focus:shadow-card"
      >
        Skip to main content
      </a>
      <Navbar />
      {/* clip (not hidden) so off-screen motion never adds a horizontal scrollbar
          while position: sticky keeps working on inner pages */}
      <main id="main-content" className="w-full max-w-full flex-1 overflow-x-clip">
        {children}
      </main>
      <Footer />
    </>
  );
}
