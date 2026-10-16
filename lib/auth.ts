import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Cookie-based admin session, signed with HMAC-SHA256.
 *
 * Credentials come from env vars (see .env.example):
 *   ADMIN_EMAIL / ADMIN_PASSWORD — dashboard login
 *   AUTH_SECRET — session signing key (set a long random string in production)
 *
 * Demo defaults let the dashboard work out of the box; the login page shows
 * them only while you haven't configured your own.
 */
export const ADMIN_COOKIE = "asb_admin_session";
const SESSION_HOURS = 8;

export const DEMO_ADMIN_EMAIL = "admin@azuresands.local";
export const DEMO_ADMIN_PASSWORD = "azure-demo-2026";

function adminEmail() {
  return process.env.ADMIN_EMAIL ?? DEMO_ADMIN_EMAIL;
}
function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? DEMO_ADMIN_PASSWORD;
}
function secret() {
  return process.env.AUTH_SECRET ?? "dev-only-secret-change-me";
}

export function isUsingDemoCredentials() {
  return !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(email: string, password: string) {
  return (
    safeEqual(email.trim().toLowerCase(), adminEmail().toLowerCase()) &&
    safeEqual(password, adminPassword())
  );
}

export function createSessionToken() {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${adminEmail()}|${expiry}`;
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString();
  } catch {
    return false;
  }
  if (!safeEqual(sign(payload), signature)) return false;
  const expiry = Number(payload.split("|")[1]);
  return Number.isFinite(expiry) && Date.now() < expiry;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** Guard for admin pages — redirects to the login screen. */
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

/** Guard for admin API routes — returns false so the route can 401. */
export async function requireAdminApi(): Promise<boolean> {
  return isAdminAuthenticated();
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  };
}
