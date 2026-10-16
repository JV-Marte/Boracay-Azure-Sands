import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { requireAdminPage } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="flex min-h-svh flex-col bg-sand-50 lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
