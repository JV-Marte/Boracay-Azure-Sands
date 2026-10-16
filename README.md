# Azure Sands Boracay Condotel

A production-ready condotel booking website for a property on Boracay Island,
Philippines. Guests browse suites, check live availability, book with a clear
price breakdown, and manage their reservation — staff run everything from a
built-in admin dashboard.

The repo carries **three separately demonstrable products** on one codebase, one
design system, and one admin dashboard, all under the Azure Sands Boracay brand:
the condotel booking engine, **Azure Sands Fitness** (`/gym`) with membership
sign-ups, and **Azure Sands Cafe** (`/cafe`) with online food ordering. Both
venues are linked from the main site's navigation, home page, and footer. See
[Modules](#modules) for what each one does and how to demo it.

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
  inquiry inbox, CSV export — plus a kitchen board and a gym sign-up pipeline
  for the two add-on modules.
- **Three products, one stack** — the condotel, a gym site with membership
  sign-ups, and a food-ordering system with room-charge, pickup, and delivery.

## Modules

Three products share this codebase. The two venues are on-property amenities of
the condotel — reachable from its navigation and home page — but each has its own
layout and navigation, so any one of them can be demoed on its own.

| Module | Routes | Admin | What it demonstrates |
|---|---|---|---|
| **Azure Sands Condotel** | `/`, `/rooms`, `/booking`, `/manage-booking` | Bookings, rooms, blocked dates, promos, reviews, inquiries | Availability, pricing, race-safe booking, guest self-service |
| **Azure Sands Fitness** | `/gym`, `/gym/schedule`, `/gym/join` | Gym sign-ups | Marketing site, class timetable, membership lead capture |
| **Azure Sands Cafe** | `/cafe`, `/cafe/menu`, `/cafe/checkout`, `/cafe/track` | Kitchen board | Cart, three fulfillment modes, live order status |

### Azure Sands Fitness (`/gym`)

A dark-themed marketing site for the resort gym: facilities, four training zones,
three coaches, a 13-session weekly timetable, and six membership tiers from a
₱250 day pass to a ₱13,500 annual. `/gym/join` captures a membership sign-up
(`ASF-XXXXXXXX`), which lands in the admin dashboard under **Gym sign-ups** with
a `new → contacted → enrolled → declined` pipeline.

Content lives in `lib/data/gym.ts` — plans, classes, coaches, facilities, and
FAQs are plain exported arrays, so prices and the timetable are a one-file edit.

**To demo it:** open `/gym`, pick a plan, submit the form, land on the
confirmation page with a reference, then open `/admin/gym-signups` and move the
lead along.

### Azure Sands Cafe (`/cafe`)

A working food-ordering system with 29 menu items across 7 sections. The cart
lives in `localStorage` (`components/cafe/cart-store.ts`) and is read through
`useSyncExternalStore`, so it survives reloads and navigation. Prices are
VAT-inclusive; the only thing added at checkout is the fee for whichever
fulfillment mode is chosen:

| Mode | Fee | How it settles |
|---|---|---|
| **Deliver to room** | +10% room service | Verified against a real booking, then billed to the stay |
| **Pick up at the counter** | none | Paid at the counter |
| **Deliver on the island** | ₱59, ₱500 minimum | Cash on delivery |

Room delivery is the interesting one: the guest enters their booking reference
and email, and `createFoodOrder()` calls the condotel's own
`findBooking()` (`services/bookings.ts`) before the kitchen sees the ticket.
Cancelled and checked-out stays are refused.

Orders get an `ASC-XXXXXXXX` reference and a status page at
`/cafe/orders/<reference>` that polls while the order is live. Staff work
tickets on a four-column kitchen board at `/admin/orders` that refreshes itself
every 30 seconds.

**To demo it:** grab a confirmed booking reference and email from
`/admin/bookings`, add a few dishes at `/cafe/menu`, check out with "deliver to
my room", then advance the ticket on `/admin/orders` and watch the guest's
status page follow along.

### Adding a fourth module

The pattern is deliberately repeatable: content as plain arrays in `lib/data/`,
a dual-mode service in `services/`, route handlers under `app/api/`, a route
group with its own layout in `app/(…)/`, and one admin page. A sundries shop or
spa booking would reuse the cafe's catalog, cart, and checkout almost unchanged.

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
  (site)/               Condotel pages (home, rooms, booking, gallery, …)
  (gym)/                Azure Sands Fitness (/gym, schedule, join)
  (cafe)/               Azure Sands Cafe (/cafe, menu, checkout, track)
  admin/                Admin dashboard (login + guarded (dashboard) group)
  api/                  Route handlers (bookings, gym, cafe, admin, …)
components/
  ui/                   Design-system primitives (Button, Field, Modal, Toast, …)
  rooms/ booking/       Feature components (RoomCard, BookingWizard, calendar, …)
  gym/ cafe/            Module chrome, sections, cart store, checkout
  admin/ home/ …        Admin tables/forms, home sections
lib/
  constants.ts          SITE, GYM, CAFE info + pricing rules  ← edit here
  pricing.ts            Stay quote calculator (fees, VAT, discounts)
  food-pricing.ts       Order totals, kitchen hours, delivery minimum
  auth.ts               Signed-cookie admin sessions
  data/                 Sample data (rooms, gym, menu) + in-memory demo store
  email/                Confirmation email template + Resend sending
  supabase/             Server-side Supabase client + module-table fallback
services/               Data access layer (Supabase OR demo store)
supabase/               schema.sql + seed.sql + modules.sql
scripts/                Placeholder generator (Pillow), image optimizer (sips)
public/images/          Photos — rooms/, gym/, cafe/menu/
```

## Supabase setup (production data)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run **`supabase/schema.sql`** (tables, constraints, RLS),
   then **`supabase/seed.sql`** (4 sample rooms, bookings, reviews, promos),
   then **`supabase/modules.sql`** (gym sign-ups and cafe orders).
3. Copy `.env.example` to `.env.local` and fill in from
   *Project Settings → API*:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — required for writes)
4. Restart `npm run dev`. The app detects the env vars and switches from the
   demo store to Supabase automatically — no code changes.

Re-running the seed is safe (it upserts by natural keys). Schema changes are
idempotent too (`create table if not exists`).

**`supabase/modules.sql`** creates `gym_signups`, `food_orders`, and
`food_order_items` for the two venues. It is idempotent and also carries the
migration that renamed `kalibo_delivery` to `island_delivery` and the old
`RFC-`/`RSC-` references to `ASF-`/`ASC-`, so re-running it on an existing
database is safe and sufficient. Until you run it, those two
services fall back to the in-memory demo store and log a one-line warning —
the marketing pages, the sign-up form, and the ordering flow all keep working,
but nothing is persisted. Everything else is unaffected.

**Optional — `supabase/channel-sync.sql`.** Adds a `channel_feeds` table and
provenance columns on `blocked_dates` (`source`, `external_uid`, `synced_at`) so
availability can be kept in step with Airbnb and Booking.com over iCal. Needed
only if you run the [channel sync workflows](../azure-sands-channel-sync);
no application code depends on it, and existing blocked dates default to
`source = 'manual'`.

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

### Module content

| To change | Edit |
|---|---|
| Gym plans, classes, coaches, facilities, FAQs | `lib/data/gym.ts` |
| Cafe menu items, categories, prices, tags | `lib/data/menu.ts` |
| Gym / cafe name, address, phone, opening hours | `GYM` and `CAFE` in `lib/constants.ts` |
| Island delivery area shown at checkout | `DELIVERY_AREA` in `lib/constants.ts` |
| Room-service %, delivery fee, minimum order | `CAFE_PRICING` in `lib/constants.ts` |
| Kitchen hours (order cut-off) | `CAFE.openHour` / `CAFE.closeHour` |

**Logo.** `components/ui/Logo.tsx` renders the full lockup — mark plus wordmark
as artwork, not live text — in three brands (`main`, `fitness`, `cafe`) and two
colourways (`dark` for light backgrounds, `light` for dark ones), from
`public/images/brand/logo-<brand>[-light].png`. Because the name lives in the
image, the component's `alt` carries it and gives the wrapping link its
accessible name; pass `alt=""` only when something adjacent already names it.

The favicon set is generated from the mark alone (`public/images/brand/mark.png`)
into `app/icon.png`, `app/apple-icon.png`, and `app/favicon.ico`. Original
full-resolution lockups are kept as `lockup-*.png`, and two rejected mark
concepts as `concept-a.png` / `concept-c.png`.

Photos are generated with the `codex` CLI and then shrunk for the web:

```bash
codex exec -m gpt-5.5 -s workspace-write "generate ... save to public/images/cafe/menu/x.png"
./scripts/optimize-images.sh          # 1400px JPEG q80, deletes the PNGs
```

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
- Gym: choose a plan on `/gym`, submit `/gym/join`, `ASF-` confirmation page
  renders, lead advances through `/admin/gym-signups`
- Cafe (room charge): confirmed reference + email from `/admin/bookings`, order
  at `/cafe/menu`, check out to room, 10% room-service line appears, ticket
  walks through `/admin/orders` while `/cafe/orders/<ref>` follows along
- Cafe (rejections): bogus booking reference refused, island delivery under
  ₱500 refused, ordering outside 6 AM–10 PM blocked
- Cafe (pickup): order without a booking, then find it at `/cafe/track` with
  the reference and phone number

## Known limitations

- Payment methods are mocks — no real charging until a gateway is wired in.
- Demo mode (no Supabase) is single-process and resets on server restart.
- Admin auth is a single credential pair; swap in Supabase Auth if you need
  multiple staff accounts with roles (the `users` table is ready for it).
- All photography is AI-generated for the demo. Replace it with real shots of
  the actual property, gym floor, and dishes before launch.
- Gym membership sign-ups are leads, not accounts: no member portal, no class
  booking with capacity limits, no check-in tracking.
- Cafe orders settle on fulfillment (room bill, counter, or cash) — there is no
  online payment step, and menu availability is a static flag rather than live
  stock.

## Recommended next steps

1. Real photography + final property address (updates map, distances, SEO).
2. PayMongo or Stripe integration with webhooks updating `payment_status`.
3. Post-stay review collection (email link → pending review in the dashboard).
4. ~~iCal sync to block dates from Airbnb/Booking.com listings.~~ Built as n8n
   workflows — see [`../azure-sands-channel-sync`](../azure-sands-channel-sync)
   and run `supabase/channel-sync.sql`.
5. Rate seasons (peak/off-peak pricing) in the quote calculator.
6. A sundries shop or spa booking as a fourth module — the cafe's catalog,
   cart, and checkout carry over almost unchanged (see [Modules](#modules)).
7. Class booking with capacity limits for the gym, and SMS notifications when a
   cafe order changes status.
