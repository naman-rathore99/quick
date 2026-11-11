begin;

alter table public.bookings
  add column if not exists request_id uuid,
  add column if not exists quantity integer not null default 1 check (quantity between 1 and 10),
  add column if not exists contact_name text,
  add column if not exists contact_phone text,
  add column if not exists service_address text;

create unique index if not exists bookings_customer_request
  on public.bookings (customer_id, request_id) where request_id is not null;

create unique index if not exists bookings_active_provider_slot
  on public.bookings (provider_id, scheduled_for)
  where provider_id is not null and status in ('PENDING', 'ACCEPTED');

commit;
