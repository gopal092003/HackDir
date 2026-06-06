-- ============================================================
-- Hackathon Directory — Supabase Setup Script
-- Run this in the Supabase SQL editor in order
-- ============================================================


-- ─── 1. Tables ───────────────────────────────────────────────

create table hackathons (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  url                   text not null,
  prize_display         text,
  prize_amount          numeric,
  tags                  text[],
  priority              text,
  github_repo           text,
  registration_deadline timestamptz,
  start_time            timestamptz not null,
  end_time              timestamptz not null,
  journal               text,
  achievement           text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now(),
  check (end_time > start_time)
);

create table sites (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  url        text not null,
  created_at timestamptz default now()
);


-- ─── 2. Indexes ──────────────────────────────────────────────

create index idx_hackathons_start_time   on hackathons(start_time);
create index idx_hackathons_end_time     on hackathons(end_time);
create index idx_hackathons_prize_amount on hackathons(prize_amount);


-- ─── 3. Auto updated_at trigger ─────────────────────────────

create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_update_hackathons
  before update on hackathons
  for each row
  execute procedure update_updated_at();


-- ─── 4. Status view ─────────────────────────────────────────

create or replace view hackathons_view as
select
  *,
  case
    when now() < start_time then 'Upcoming'
    when now() > end_time   then 'Completed'
    else                         'Live'
  end as status
from hackathons;


-- ─── 5. Enable RLS ──────────────────────────────────────────

alter table hackathons enable row level security;
alter table sites       enable row level security;


-- ─── 6. Public read policies ────────────────────────────────

create policy "public read hackathons"
  on hackathons
  for select
  using (true);

create policy "public read sites"
  on sites
  for select
  using (true);


-- ─── 7. Admin policies ──────────────────────────────────────
-- IMPORTANT: Replace 'YOUR_USER_ID' with your Supabase Auth user UUID.
-- Find it in: Authentication → Users → copy the UUID column.

create policy "admin manage hackathons"
  on hackathons
  for all
  using      (auth.uid() = 'YOUR_USER_ID')
  with check (auth.uid() = 'YOUR_USER_ID');

create policy "admin manage sites"
  on sites
  for all
  using      (auth.uid() = 'YOUR_USER_ID')
  with check (auth.uid() = 'YOUR_USER_ID');


-- ─── Done ────────────────────────────────────────────────────
-- After running this script:
-- 1. Go to Authentication → Users → Add user (email + password)
-- 2. Copy the new user's UUID and replace YOUR_USER_ID above,
--    then re-run the two admin policy statements.
-- 3. Go to Authentication → Settings → disable "Enable Signups".
