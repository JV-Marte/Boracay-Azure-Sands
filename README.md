# Azure Sands Boracay Condotel

A production-ready condotel booking website for a property on Boracay Island,
Philippines. Guests browse suites, check live availability, book with a clear
price breakdown, and manage their reservation — staff run everything from a
built-in admin dashboard.

**Tech stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 ·
Supabase (Postgres) · React Hook Form + Zod · date-fns · Lucide icons · Resend

## Highlights

- **Zero-setup demo mode** — without any env vars the app runs on an in-memory
  store seeded with 4 rooms, sample bookings, reviews, and promo codes. Every
  flow (booking, manage booking, admin) works out of the box.
- **Race-safe double-booking prevention** — an app-level availability check in
  both modes, plus a Postgres `EXCLUDE USING gist` daterange constraint in
  Supabase mode so two overlapping bookings can never be committed.
- **Complete booking engine** — nights/fees/12% VAT computed server-side,
  automatic 10% long-stay discount (7+ nights), stackable promo codes, unique
  booking references (`ASB-XXXXXXXX`), confirmation emails.
- **Admin dashboard** — occupancy and revenue stats, booking confirmation and
  payment tracking, room CRUD, blocked dates, promo codes, review moderation,
  inquiry inbox, CSV export.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000 — runs in demo mode, no config needed
```

Admin dashboard: <http://localhost:3000/admin>
Demo login (shown on the login page until you set your own):
`admin@azuresands.local` / `azure-demo-2026`

> Demo-mode data lives in server memory: it survives hot reloads but resets
> when the dev server restarts. Connect Supabase for persistence.

## Project structure

```
app/                    Pages (App Router)
  (site)/               Public pages (home, rooms, booking, gallery, …)
  admin/                Admin dashboard (login + guarded (dashboard) group)
  api/                  Route handlers (bookings, availability, admin, …)
components/
  ui/                   Design-system primitives (Button, Field, Modal, Toast, …)
  rooms/ booking/       Feature components (RoomCard, BookingWizard, calendar, …)
  admin/ home/ …        Admin tables/forms, home sections
lib/
  constants.ts          Site info, contact details, pricing rules  ← edit here
  pricing.ts            Quote calculator (fees, VAT, discounts)
  auth.ts               Signed-cookie admin sessions
  data/                 Sample data + in-memory demo store
  email/                Confirmation email template + Resend sending
  supabase/             Server-side Supabase client
services/               Data access layer (Supabase OR demo store)
supabase/               schema.sql + seed.sql
scripts/                Placeholder image generator (Pillow)
public/images/          Photos (generated placeholders — replace with real ones)
```

## Supabase setup (production data)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run **`supabase/schema.sql`** (tables, constraints, RLS),
   then **`supabase/seed.sql`** (4 sample rooms, bookings, reviews, promos).
3. Copy `.env.example` to `.env.local` and fill in from
   *Project Settings → API*:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — required for writes)
4. Restart `npm run dev`. The app detects the env vars and switches from the
   demo store to Supabase automatically — no code changes.

Re-running the seed is safe (it upserts by natural keys). Schema changes are
idempotent too (`create table if not exists`).

## Environment variables

All optional in local demo mode — see `.env.example` for full comments.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL (SEO, sitemap, email links) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side writes (never expose to the client) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Dashboard login (replaces demo credentials) |
| `AUTH_SECRET` | Signs admin session cookies — set a long random string in prod |
| `RESEND_API_KEY` / `EMAIL_FROM` | Confirmation emails (logged to console if unset) |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Map on Location/Contact sections |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Future payment integration |

## Email setup

Confirmation emails send through [Resend](https://resend.com):

1. Create an API key, set `RESEND_API_KEY`.
2. Verify your domain and set `EMAIL_FROM` (e.g. `Azure Sands <stay@yourdomain.com>`).
3. Without a key, emails are logged to the server console so the flow is testable.

The HTML template lives in `lib/email/booking-confirmation.ts`. A failed email
never fails a booking.

## Payments

All methods (pay later, card, GCash, Maya, bank transfer) are **placeholders**:
bookings store the chosen method with `payment_status: "pending"` and staff mark
them paid in the dashboard. Integration points:

- **Card** — Stripe Checkout or PayMongo card element; create the session in
  `app/api/bookings/route.ts` after `createBooking()` succeeds, and update
  `payment_status` in a webhook handler.
- **GCash / Maya** — PayMongo Sources API or Maya Checkout, same hook point.
- Method definitions and labels live in `lib/payments.ts`.

## Everyday content edits

- **Room prices / details** — Admin → Rooms → Edit (or update `rooms` in
  Supabase / `lib/data/rooms.ts` for the demo seed).
- **Blocked dates** — Admin → Blocked dates. The end date is exclusive
  (the room is bookable again from that day).
- **Photos** — room photos live in `public/images/rooms/<room-slug>/` (five
  shots per room: interior, bedroom, balcony, bathroom, view); reference them
  per room in Admin → Rooms and in `lib/data/gallery.ts` (gallery page).
  Shared-space shots (beach, pool, property) are still generated placeholders —
  regenerate with `python3 scripts/generate-placeholders.py` (needs Pillow).
- **Contact info, check-in times, fees, VAT, discounts** — `lib/constants.ts`
  (`SITE` and `PRICING`). Fee changes apply to new quotes instantly.
- **FAQ / attractions / amenity list** — `lib/data/faqs.ts`,
  `lib/data/attractions.ts`, `lib/data/amenities.ts`.
- Distances marked with `*` are placeholders — update them in
  `lib/data/attractions.ts` once the exact property address is final.

## Booking rules (implemented server-side)

- Check-out must be after check-in; minimum 1 night, maximum 30 online.
- Guests cannot exceed room capacity; check-in cannot be in the past.
- Pending + confirmed bookings and blocked dates block availability;
  cancelled/completed release it. Ranges are half-open — check-out day frees up
  for the next guest.
- Totals: `subtotal − discounts + ₱750 cleaning + 5% service fee + 12% VAT`.
- Cancellation via Manage Booking is allowed until the day before check-in;
  paid bookings are flagged `refunded` for staff processing.

## Deploying to Vercel

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com)
   (framework auto-detected: Next.js).
2. Add the environment variables above in *Project → Settings → Environment
   Variables* — at minimum the three Supabase values, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL`
   (your production URL).
3. Deploy. Run the SQL files against your Supabase project if you haven't.
4. Point your domain at Vercel and update `NEXT_PUBLIC_SITE_URL`.

> Don't deploy without Supabase configured: serverless instances don't share
> memory, so demo-mode bookings wouldn't persist between requests.

## Testing checklist

- `npm run lint` · `npx tsc --noEmit` · `npm run build` all pass
- Home: hero search routes to /rooms with dates; sections render
- Rooms: filters (guests, price, type, bed, amenities), date search shows
  availability badges, empty state appears when nothing matches
- Room details: gallery, availability calendar shows booked/blocked dates,
  booking widget blocks conflicting dates and shows the price breakdown
- Booking wizard: step validation, availability re-check, promo `WELCOME10`
  (10%) and `ISLAND500` (₱500), payment selection, confirmation page + print
- Double-booking attempt returns 409; cancelled dates rebookable immediately
- Manage booking: lookup (wrong email rejected), edit guest info, cancel
- Contact form → appears in Admin → Inquiries
- Admin: login guard (pages redirect, APIs 401), stats, booking
  confirm/cancel/payment updates, room CRUD, blocked dates, promo codes,
  review moderation, CSV export

## Known limitations

- Payment methods are mocks — no real charging until a gateway is wired in.
- Demo mode (no Supabase) is single-process and resets on server restart.
- Admin auth is a single credential pair; swap in Supabase Auth if you need
  multiple staff accounts with roles (the `users` table is ready for it).
- Room photos are real; the beach/pool/property shots are still generated
  gradient placeholders — replace with real photography before launch.

## Recommended next steps

1. Real photography + final property address (updates map, distances, SEO).
2. PayMongo or Stripe integration with webhooks updating `payment_status`.
3. Post-stay review collection (email link → pending review in the dashboard).
4. iCal sync to block dates from Airbnb/Booking.com listings.
5. Rate seasons (peak/off-peak pricing) in the quote calculator.
