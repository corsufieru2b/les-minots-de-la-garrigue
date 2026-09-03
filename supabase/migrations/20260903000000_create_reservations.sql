create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  party_size integer not null check (party_size >= 1),
  reservation_date date not null,
  reservation_time time without time zone not null,
  comment text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.reservations enable row level security;

grant select, insert, update on table public.reservations to service_role;

create index if not exists reservations_reservation_date_time_idx
  on public.reservations (reservation_date, reservation_time);

create index if not exists reservations_status_idx
  on public.reservations (status);