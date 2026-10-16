-- ============================================================================
-- Azure Sands — channel sync schema
--
-- Adds everything workflows 04 and 04b need. Run this in the Supabase SQL
-- editor AFTER schema.sql and seed.sql.
--
-- Safe to re-run: every statement is idempotent.
-- No application code changes. The booking site already treats any row in
-- blocked_dates as unavailable, so synced blocks take effect immediately.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- channel_feeds — one row per room per sales channel
--
-- The iCal URLs live in the database rather than inside the workflow so that
-- adding a listing is a row insert, not a workflow edit. A workflow you have to
-- open and redeploy to add a room is a workflow the owner cannot maintain.
-- ---------------------------------------------------------------------------
create table if not exists public.channel_feeds (
  id             uuid primary key default gen_random_uuid(),
  room_id        text not null references public.rooms (id) on delete cascade,
  channel        text not null check (channel in ('airbnb', 'booking_com', 'agoda', 'vrbo', 'other')),
  ical_url       text not null,
  active         boolean not null default true,
  last_synced_at timestamptz,
  last_status    text,
  created_at     timestamptz not null default now(),
  unique (room_id, channel)
);

comment on table public.channel_feeds is
  'Inbound iCal subscriptions. One row per room per OTA listing.';
comment on column public.channel_feeds.last_status is
  'Result of the most recent sync attempt: "ok: 3 upserted, 1 removed" or the error.';


-- ---------------------------------------------------------------------------
-- blocked_dates — provenance
--
-- `source` is the load-bearing column in this whole design. It splits the table
-- into two ownership zones:
--
--   source = 'manual'   Created by staff in the admin dashboard. The sync must
--                       never touch these rows. A maintenance block someone
--                       entered on purpose cannot be deleted by a robot.
--
--   source = 'airbnb'   Owned entirely by the sync. It may insert, update, and
--            'booking_com'  delete these freely, because it is the only writer.
--
-- Without this column the sync has two bad options: clobber human entries, or
-- never delete anything and leave stale blocks forever. Ownership boundaries
-- are what make a two-way sync safe.
-- ---------------------------------------------------------------------------
alter table public.blocked_dates
  add column if not exists source              text not null default 'manual',
  add column if not exists external_uid        text,
  add column if not exists synced_at           timestamptz,
  add column if not exists conflict_alerted_at timestamptz;

-- Existing rows were all created by staff, which the default already handles.

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'chk_blocked_source'
  ) then
    alter table public.blocked_dates
      add constraint chk_blocked_source
      check (source in ('manual', 'airbnb', 'booking_com', 'agoda', 'vrbo', 'other'));
  end if;
end $$;

-- The idempotency key. `on conflict` targets this index, which is what turns a
-- sync running every 30 minutes forever into a no-op instead of 48 duplicate
-- rows a day. Partial, because manual blocks have no external_uid and several
-- of them being NULL must not collide.
create unique index if not exists uq_blocked_external
  on public.blocked_dates (room_id, source, external_uid)
  where external_uid is not null;

create index if not exists idx_blocked_source on public.blocked_dates (source);


-- ---------------------------------------------------------------------------
-- Register the test feeds
--
-- Replace both URLs with your own Gist raw URLs (see test-fixtures/README).
-- In production these are the real export URLs:
--   Airbnb      Listing -> Availability -> Sync calendars -> Export calendar
--   Booking.com Calendar -> Sync calendars -> Export
--
-- An Airbnb export URL is a bearer token in disguise: anyone holding it can read
-- when that unit is occupied. Treat it as a secret.
-- ---------------------------------------------------------------------------
insert into public.channel_feeds (room_id, channel, ical_url)
values
  ('room-ocean-view-suite', 'airbnb',
   'REPLACE_WITH_YOUR_AIRBNB_ICS_URL'),
  ('room-deluxe-studio',    'booking_com',
   'REPLACE_WITH_YOUR_BOOKING_COM_ICS_URL')
on conflict (room_id, channel) do update
  set ical_url = excluded.ical_url,
      active   = true;


-- ---------------------------------------------------------------------------
-- Verify
-- ---------------------------------------------------------------------------

-- Should return 2 rows.
select cf.channel, r.name as room, cf.active, cf.ical_url
from public.channel_feeds cf
join public.rooms r on r.id = cf.room_id
order by r.name;

-- Should return the seeded maintenance block with source = 'manual'.
select r.name as room, bd.start_date, bd.end_date, bd.reason, bd.source, bd.external_uid
from public.blocked_dates bd
join public.rooms r on r.id = bd.room_id
order by bd.start_date;
