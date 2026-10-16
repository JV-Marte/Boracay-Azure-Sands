-- ---------------------------------------------------------------------------
-- Azure Sands Fitness + Azure Sands Cafe
--
-- The two add-on modules that share this codebase with the condotel. Run this
-- AFTER supabase/schema.sql — it reuses public.touch_updated_at() from there.
--
-- Safe to re-run: every statement is idempotent.
--
--   Supabase dashboard → SQL Editor → paste → Run
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- gym_signups — membership enquiries from /gym/join
-- ---------------------------------------------------------------------------
create table if not exists public.gym_signups (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  plan_id text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_start date not null,
  goal text,
  is_hotel_guest boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'enrolled', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gym_signups_status on public.gym_signups (status, created_at desc);
create index if not exists idx_gym_signups_email on public.gym_signups (email);

-- ---------------------------------------------------------------------------
-- food_orders — cafe orders from /cafe/checkout
--
-- Menu prices are VAT-inclusive, so there is no tax column: `fees` holds the
-- room-service charge or the delivery fee, whichever applies.
-- ---------------------------------------------------------------------------
create table if not exists public.food_orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  fulfillment_type text not null
    check (fulfillment_type in ('room_delivery', 'pickup', 'island_delivery')),
  -- Set only for room deliveries: the stay this order is billed to.
  booking_reference text,
  room_note text,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address text,
  scheduled_for timestamptz,
  notes text,
  subtotal integer not null check (subtotal >= 0),
  fees integer not null default 0 check (fees >= 0),
  total integer not null check (total >= 0),
  status text not null default 'received'
    check (status in ('received', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Each fulfillment mode requires its own fields.
  constraint chk_fulfillment_fields check (
    (fulfillment_type = 'room_delivery' and booking_reference is not null)
    or (fulfillment_type = 'island_delivery' and delivery_address is not null)
    or (fulfillment_type = 'pickup')
  )
);

create index if not exists idx_food_orders_status on public.food_orders (status, created_at desc);
create index if not exists idx_food_orders_created on public.food_orders (created_at desc);
create index if not exists idx_food_orders_booking on public.food_orders (booking_reference);
create index if not exists idx_food_orders_phone on public.food_orders (customer_phone);

-- ---------------------------------------------------------------------------
-- food_order_items — one row per line. Name and price are denormalised so an
-- old order still reads correctly after the menu changes.
-- ---------------------------------------------------------------------------
create table if not exists public.food_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.food_orders (id) on delete cascade,
  menu_item_id text not null,
  name text not null,
  unit_price integer not null check (unit_price >= 0),
  qty integer not null check (qty > 0),
  notes text
);

create index if not exists idx_food_order_items_order on public.food_order_items (order_id);

-- ---------------------------------------------------------------------------
-- Migration: 'kalibo_delivery' was renamed to 'island_delivery' when the cafe
-- moved from Kalibo to Boracay. Harmless on a fresh database.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'food_orders'
  ) then
    alter table public.food_orders drop constraint if exists food_orders_fulfillment_type_check;
    alter table public.food_orders drop constraint if exists chk_fulfillment_fields;

    update public.food_orders
       set fulfillment_type = 'island_delivery'
     where fulfillment_type = 'kalibo_delivery';

    -- Old RFC-/RSC- references predate the Azure Sands rebrand.
    update public.food_orders
       set reference = 'ASC-' || substring(reference from 5)
     where reference like 'RSC-%';
    update public.gym_signups
       set reference = 'ASF-' || substring(reference from 5)
     where reference like 'RFC-%';

    alter table public.food_orders add constraint food_orders_fulfillment_type_check
      check (fulfillment_type in ('room_delivery', 'pickup', 'island_delivery'));
    alter table public.food_orders add constraint chk_fulfillment_fields check (
      (fulfillment_type = 'room_delivery' and booking_reference is not null)
      or (fulfillment_type = 'island_delivery' and delivery_address is not null)
      or (fulfillment_type = 'pickup')
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- updated_at triggers (function defined in schema.sql)
-- ---------------------------------------------------------------------------
drop trigger if exists trg_gym_signups_updated on public.gym_signups;
create trigger trg_gym_signups_updated before update on public.gym_signups
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_food_orders_updated on public.food_orders;
create trigger trg_food_orders_updated before update on public.food_orders
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Same posture as schema.sql: the app writes with the service-role key, so RLS
-- is enabled with no policies at all. Nothing is publicly readable — orders and
-- signups contain guest contact details.
-- ---------------------------------------------------------------------------
alter table public.gym_signups enable row level security;
alter table public.food_orders enable row level security;
alter table public.food_order_items enable row level security;

-- ---------------------------------------------------------------------------
-- Demo seed — mirrors the in-memory demo store so the admin dashboard has
-- something to show immediately. Delete these rows before going live.
-- ---------------------------------------------------------------------------
insert into public.gym_signups
  (id, reference, plan_id, full_name, email, phone, preferred_start, goal, is_hotel_guest, status, created_at)
values
  ('a1000000-0000-4000-8000-000000000001', 'ASF-SEED4K7P', 'plan-monthly',
   'Rico Delgado', 'rico.delgado@example.com', '+63 917 555 0111',
   current_date + 2, 'Back to three sessions a week after a year off. Mostly strength.',
   false, 'new', now() - interval '1 day'),
  ('a1000000-0000-4000-8000-000000000002', 'ASF-SEEDJ92X', 'plan-annual',
   'Aileen Bautista', 'aileen.bautista@example.com', '+63 928 555 0174',
   current_date + 7, 'Zumba twice a week plus whatever Coach Dexter is running.',
   false, 'contacted', now() - interval '4 days'),
  ('a1000000-0000-4000-8000-000000000003', 'ASF-SEEDQ38R', 'plan-hotel-guest',
   'Tom Reyner', 'tom.reyner@example.com', '+61 4 5555 0148',
   current_date, 'Just need a treadmill while I am on the island for the week.',
   true, 'enrolled', now() - interval '9 days')
on conflict (reference) do nothing;

insert into public.food_orders
  (id, reference, fulfillment_type, booking_reference, room_note, customer_name,
   customer_phone, customer_email, delivery_address, notes, subtotal, fees, total, status, created_at)
values
  ('b1000000-0000-4000-8000-000000000001', 'ASC-SEED2P7K', 'room_delivery',
   'ASB-DEMO2345', 'Please knock, doorbell is broken', 'Isabel Reyes',
   '+63 917 555 0192', 'isabel.reyes@example.com', null, null,
   810, 81, 891, 'preparing', now() - interval '12 minutes'),
  ('b1000000-0000-4000-8000-000000000002', 'ASC-SEEDH4XQ', 'pickup',
   null, null, 'Marco de la Cruz', '+63 939 555 0166', null, null, null,
   630, 0, 630, 'ready', now() - interval '26 minutes'),
  ('b1000000-0000-4000-8000-000000000003', 'ASC-SEEDB93M', 'island_delivery',
   null, null, 'Grace Tan', '+63 920 555 0133', null,
   'Villa Sunrise, D''Mall Road, Station 2, Balabag — blue gate past the pharmacy',
   'Call when you reach the corner.',
   930, 59, 989, 'out_for_delivery', now() - interval '41 minutes')
on conflict (reference) do nothing;

insert into public.food_order_items (id, order_id, menu_item_id, name, unit_price, qty, notes)
values
  ('c1000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000001', 'menu-sizzling-sisig', 'Sizzling Pork Sisig', 285, 1, 'Extra calamansi'),
  ('c1000000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000001', 'menu-chicken-inasal', 'Chicken Inasal', 195, 1, null),
  ('c1000000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000001', 'menu-mango-shake', 'Fresh Mango Shake', 165, 2, null),
  ('c1000000-0000-4000-8000-000000000004', 'b1000000-0000-4000-8000-000000000002', 'menu-chorizo-pizza', 'Aklan Chorizo Pizza', 380, 1, null),
  ('c1000000-0000-4000-8000-000000000005', 'b1000000-0000-4000-8000-000000000002', 'menu-buffalo-wings', 'Buffalo Wings', 250, 1, null),
  ('c1000000-0000-4000-8000-000000000006', 'b1000000-0000-4000-8000-000000000003', 'menu-kare-kare', 'Kare-Kare', 340, 1, null),
  ('c1000000-0000-4000-8000-000000000007', 'b1000000-0000-4000-8000-000000000003', 'menu-chicken-adobo', 'Chicken Adobo', 230, 1, null),
  ('c1000000-0000-4000-8000-000000000008', 'b1000000-0000-4000-8000-000000000003', 'menu-halo-halo', 'Halo-Halo Especial', 180, 2, null)
on conflict (id) do nothing;

-- Verify
select 'gym_signups' as table_name, count(*) from public.gym_signups
union all
select 'food_orders', count(*) from public.food_orders
union all
select 'food_order_items', count(*) from public.food_order_items;
