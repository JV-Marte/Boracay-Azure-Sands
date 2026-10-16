-- ============================================================================
-- Azure Sands Boracay Condotel — seed data
-- Run AFTER schema.sql. Sample bookings use CURRENT_DATE offsets so the demo
-- always shows upcoming check-ins. Safe to re-run (upserts by natural key).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Rooms
-- ---------------------------------------------------------------------------
insert into public.rooms
  (id, name, slug, description, room_type, price_per_night, max_guests,
   bed_type, bed_summary, room_size, amenities, images, status)
values
  (
    'room-deluxe-studio', 'Deluxe Studio', 'deluxe-studio',
    'A bright, calm studio finished in warm sand tones and woven island textures — an easy base for couples and solo travelers. The queen bed faces a wall-mounted smart TV, while the kitchenette (induction hob, microwave, full-size fridge) makes slow mornings simple. Coffee on your private balcony, then a short stroll to White Beach.',
    'studio', 4500, 2, 'queen', '1 queen bed', 28,
    '["wifi","aircon","kitchenette","balcony","smart_tv","housekeeping","pool","beach_access","luggage_storage","security"]'::jsonb,
    '["/images/rooms/deluxe-studio/interior.png","/images/rooms/deluxe-studio/bedroom.png","/images/rooms/deluxe-studio/balcony.png","/images/rooms/deluxe-studio/bathroom.png","/images/rooms/deluxe-studio/view.png"]'::jsonb,
    'active'
  ),
  (
    'room-family-suite', 'Family Suite', 'family-suite',
    'Our most-loved suite for families: two queen beds, a proper kitchen, and a dining area where everyone actually fits. Kids nap while you read on the balcony; in the evening, cook rice and grilled pork belly like a local or walk five minutes* to D''Mall for dinner. Cribs and high chairs are free on request.',
    'suite', 7800, 4, 'two_queens', '2 queen beds', 46,
    '["wifi","aircon","full_kitchen","dining_area","balcony","smart_tv","housekeeping","family_friendly","pool","beach_access","security"]'::jsonb,
    '["/images/rooms/family-suite/interior.png","/images/rooms/family-suite/bedroom.png","/images/rooms/family-suite/balcony.png","/images/rooms/family-suite/bathroom.png","/images/rooms/family-suite/view.png"]'::jsonb,
    'active'
  ),
  (
    'room-ocean-view-suite', 'Ocean View Suite', 'ocean-view-suite',
    'Wake to the color the island is named for. The king bed points straight at an ocean-facing balcony, and the deep soaking tub turns sunset hour into a ritual. A mini kitchen covers breakfast and halo-halo cravings; for everything else, the beachfront is just below. Best booked early — there''s only a handful of these.',
    'suite', 6900, 2, 'king', '1 king bed', 38,
    '["wifi","aircon","kitchenette","balcony","ocean_view","bathtub","smart_tv","housekeeping","pool","beach_access","security"]'::jsonb,
    '["/images/rooms/ocean-view-suite/interior.png","/images/rooms/ocean-view-suite/bedroom.png","/images/rooms/ocean-view-suite/balcony.png","/images/rooms/ocean-view-suite/bathroom.png","/images/rooms/ocean-view-suite/view.png"]'::jsonb,
    'active'
  ),
  (
    'room-premium-loft', 'Premium Loft', 'premium-loft',
    'A two-level loft that sleeps five without feeling crowded: king bed upstairs under the eaves, queen bed and a sofa bed below. The full kitchen and dining table make it the pick for barkadas and workations — fiber Wi-Fi, a real workspace, and a balcony big enough for everyone at golden hour.',
    'loft', 9500, 5, 'king_and_queen', '1 king, 1 queen + sofa bed', 62,
    '["wifi","aircon","full_kitchen","dining_area","balcony","loft_layout","sofa_bed","workspace","smart_tv","housekeeping","pool","beach_access","security"]'::jsonb,
    '["/images/rooms/premium-loft/interior.png","/images/rooms/premium-loft/bedroom.png","/images/rooms/premium-loft/balcony.png","/images/rooms/premium-loft/bathroom.png","/images/rooms/premium-loft/view.png"]'::jsonb,
    'active'
  )
on conflict (slug) do update set
  description = excluded.description,
  price_per_night = excluded.price_per_night,
  amenities = excluded.amenities,
  images = excluded.images;

-- ---------------------------------------------------------------------------
-- Sample bookings (money fields follow lib/pricing.ts: 5% service fee,
-- ₱750 cleaning fee, 12% VAT, 10% long-stay discount for 7+ nights)
-- ---------------------------------------------------------------------------
insert into public.bookings
  (booking_reference, room_id, guest_name, guest_email, guest_phone, country,
   check_in, check_out, guest_count, special_requests,
   subtotal, fees, taxes, discount, total, promo_code,
   payment_method, payment_status, booking_status, created_at)
values
  (
    'ASB-DEMO2345', 'room-ocean-view-suite', 'Isabel Reyes',
    'isabel.reyes@example.com', '+63 917 555 0192', 'Philippines',
    current_date + 3, current_date + 6, 2,
    'Celebrating our anniversary — a late check-out would be lovely if possible.',
    20700, 1785, 2698, 0, 25183, null,
    'gcash', 'paid', 'confirmed', now() - interval '12 days'
  ),
  (
    'ASB-DEMO6789', 'room-deluxe-studio', 'Nathan Cole',
    'nathan.cole@example.com', '+61 4 5555 0148', 'Australia',
    current_date + 1, current_date + 3, 1, null,
    9000, 1200, 1224, 0, 11424, null,
    'pay_later', 'pending', 'pending', now() - interval '2 days'
  ),
  (
    'ASB-DEMOFAM1', 'room-family-suite', 'Grace and Miguel Tan',
    'grace.tan@example.com', '+65 8555 0133', 'Singapore',
    current_date - 2, current_date + 2, 4,
    'One crib for our 18-month-old, please.',
    31200, 2310, 4021, 0, 37531, null,
    'card', 'paid', 'confirmed', now() - interval '20 days'
  ),
  (
    'ASB-DEMOLOFT', 'room-premium-loft', 'Jonas Weber',
    'jonas.weber@example.com', '+49 151 5550 172', 'Germany',
    current_date - 24, current_date - 17, 4, null,
    66500, 4075, 7671, 6650, 71596, null,
    'bank_transfer', 'paid', 'completed', now() - interval '45 days'
  ),
  (
    'ASB-DEMOCXL1', 'room-ocean-view-suite', 'Sophie Laurent',
    'sophie.laurent@example.com', '+33 6 55 55 01 84', 'France',
    current_date + 10, current_date + 12, 2, null,
    13800, 1440, 1829, 0, 17069, null,
    'maya', 'refunded', 'cancelled', now() - interval '8 days'
  )
on conflict (booking_reference) do nothing;

-- ---------------------------------------------------------------------------
-- Blocked dates
-- ---------------------------------------------------------------------------
insert into public.blocked_dates (room_id, start_date, end_date, reason)
select 'room-premium-loft', current_date + 10, current_date + 13, 'Aircon maintenance'
where not exists (
  select 1 from public.blocked_dates
  where room_id = 'room-premium-loft' and reason = 'Aircon maintenance'
);

-- ---------------------------------------------------------------------------
-- Promo codes
-- ---------------------------------------------------------------------------
insert into public.promo_codes
  (code, discount_type, discount_value, valid_from, valid_until, usage_limit, used_count, active)
values
  ('WELCOME10', 'percent', 10, date_trunc('year', current_date)::date,
   (date_trunc('year', current_date) + interval '2 years - 1 day')::date, null, 14, true),
  ('ISLAND500', 'fixed', 500, date_trunc('year', current_date)::date,
   (date_trunc('year', current_date) + interval '1 year - 1 day')::date, 100, 37, true)
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
insert into public.reviews (guest_name, rating, comment, stay_type, approved, created_at)
select * from (values
  ('Marielle S.', 5, 'The Family Suite was spotless and the kitchen saved us a fortune with two kids. Staff arranged our Caticlan transfer before we even asked. We''ll be back in December.', 'Family stay · 5 nights', true, now() - interval '120 days'),
  ('Daniel & Priya', 5, 'Booked the Ocean View Suite for our anniversary. Watching the sunset from the bathtub is something we still talk about. Quiet at night despite being close to Station 2.', 'Couple · 4 nights', true, now() - interval '135 days'),
  ('Tomás R.', 4, 'Stayed a month in the Premium Loft while working remotely. Wi-Fi held up on every call, and the desk setup is legit. Only wish the pool opened earlier for morning laps.', 'Long stay · 30 nights', true, now() - interval '160 days'),
  ('Aiko N.', 5, 'The Deluxe Studio is small but perfectly laid out — never felt cramped. Housekeeping was thoughtful and the balcony breeze in the morning is worth the trip alone.', 'Solo · 3 nights', true, now() - interval '90 days'),
  ('Chris B.', 4, 'Great value for Boracay. Check-in was quick, luggage storage after check-out let us squeeze in one last beach afternoon before the ferry.', 'Friends · 2 nights', true, now() - interval '60 days'),
  ('Hannah L.', 5, 'Booked last minute and the team still made it feel special — welcome fruit, early check-in, restaurant tips that were all spot on.', 'Couple · 3 nights', false, now() - interval '20 days')
) as v(guest_name, rating, comment, stay_type, approved, created_at)
where not exists (select 1 from public.reviews);

-- ---------------------------------------------------------------------------
-- Sample admin user record (informational — dashboard login is configured via
-- ADMIN_EMAIL / ADMIN_PASSWORD env vars, see README)
-- ---------------------------------------------------------------------------
insert into public.users (full_name, email, role)
values ('Azure Sands Manager', 'admin@azuresandsboracay.example', 'admin')
on conflict (email) do nothing;
