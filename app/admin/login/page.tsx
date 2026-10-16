import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  isAdminAuthenticated,
  isUsingDemoCredentials,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Staff login",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");
  const demo = isUsingDemoCredentials();

  return (
    <div className="flex min-h-svh items-center justify-center bg-ocean-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Logo brand="main" tone="light" className="h-11" />
          <h1 className="mt-4 font-display text-2xl font-medium text-white">
            Azure Sands Staff
          </h1>
          <p className="mt-1 text-sm text-ocean-300/80">
            Sign in to manage rooms, bookings, and guests.
          </p>
        </div>
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lift sm:p-8">
          <LoginForm />
          {demo && (
            <div className="mt-6 rounded-xl bg-sand-50 p-3.5 text-xs leading-relaxed text-stone-500">
              <p className="font-semibold text-stone-700">Demo credentials</p>
              <p className="mt-1">
                Email: <code className="text-ocean-700">{DEMO_ADMIN_EMAIL}</code>
                <br />
                Password: <code className="text-ocean-700">{DEMO_ADMIN_PASSWORD}</code>
              </p>
              <p className="mt-1.5 text-stone-400">
                Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local to replace these.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
