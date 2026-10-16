-- ============================================================================
-- Azure Sands Boracay Condotel — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) BEFORE seed.sql.
-- ============================================================================

-- Needed for the anti-double-booking exclusion constraint (text = with gist)
create extension if not exists btree_gist;

-- ---------------------------------------------------------------------------
-- users (site admins / staff; guests book without accounts)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- rooms
-- ---------------------------------------------------------------------------
create table if not exists public.rooms (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  description text not null,
  room_type text not null check (room_type in ('studio', 'suite', 'loft')),
  price_per_night integer not null check (price_per_night > 0),
  max_guests integer not null check (max_guests between 1 and 10),
  bed_type text not null check (bed_type in ('queen', 'king', 'two_queens', 'king_and_queen')),
  bed_summary text not null,
  room_size integer not null check (room_size > 0),
  amenities jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  room_id text not null references public.rooms (id) on delete restrict,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  country text not null,
  check_in date not null,
  check_out date not null,
  guest_count integer not null check (guest_count between 1 and 10),
  special_requests text,
  subtotal integer not null check (subtotal >= 0),
  fees integer not null default 0,
  taxes integer not null default 0,
  discount integer not null default 0,
  total integer not null check (total >= 0),
  promo_code text,
  payment_method text not null default 'pay_later'
    check (payment_method in ('pay_later', 'card', 'gcash', 'maya', 'bank_transfer')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  booking_status text not null default 'pending'
    check (booking_status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_dates check (check_out > check_in),
  -- Race-safe double-booking prevention: two pending/confirmed bookings can
  -- never overlap for the same room. daterange(a, b) is half-open [a, b), so
  -- back-to-back stays (check-out day = next check-in day) are allowed.
  constraint no_double_booking exclude using gist (
    room_id with =,
    daterange(check_in, check_out) with &&
  ) where (booking_status in ('pending', 'confirmed'))
);

create index if not exists idx_bookings_room on public.bookings (room_id);
create index if not exists idx_bookings_email on public.bookings (guest_email);
create index if not exists idx_bookings_dates on public.bookings (check_in, check_out);

-- ---------------------------------------------------------------------------
-- blocked_dates (maintenance, owner use, ...) — end_date is exclusive
-- ---------------------------------------------------------------------------
create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.rooms (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint chk_block_dates check (end_date > start_date)
);

create index if not exists idx_blocked_dates_room on public.blocked_dates (room_id);

-- ---------------------------------------------------------------------------
-- promo_codes
-- ---------------------------------------------------------------------------
create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric not null check (discount_value > 0),
  valid_from date not null,
  valid_until date not null,
  usage_limit integer,
  used_count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint chk_promo_dates check (valid_until >= valid_from)
);

-- Atomic usage counter used by the app after a successful booking
create or replace function public.increment_promo_usage(promo_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.promo_codes
  set used_count = used_count + 1
  where upper(code) = upper(promo_code);
$$;

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  stay_type text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- inquiries (contact form)
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_rooms_updated on public.rooms;
create trigger trg_rooms_updated before update on public.rooms
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- The Next.js server talks to Supabase with the SERVICE ROLE key (bypasses
-- RLS). RLS is still enabled so the anon key can only read public content.
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.rooms enable row level security;
alter table public.bookings enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.promo_codes enable row level security;
alter table public.reviews enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "Public can view active rooms" on public.rooms;
create policy "Public can view active rooms"
  on public.rooms for select
  using (status = 'active');

drop policy if exists "Public can view approved reviews" on public.reviews;
create policy "Public can view approved reviews"
  on public.reviews for select
  using (approved = true);

drop policy if exists "Public can view blocked dates" on public.blocked_dates;
create policy "Public can view blocked dates"
  on public.blocked_dates for select
  using (true);
