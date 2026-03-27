create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar_url text,
  contact text,
  rating numeric default 0,
  created_at timestamp default now()
);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  region text not null,
  product_type text not null,
  price numeric not null,
  currency text not null,
  total_slots int not null,
  available_slots int not null,
  description text not null,
  contact text,
  status text default 'active',
  created_at timestamp default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamp default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  reason text not null,
  created_at timestamp default now()
);

alter table profiles enable row level security;
alter table listings enable row level security;
alter table comments enable row level security;
alter table reports enable row level security;

create policy "profiles public read"
on profiles for select
using (true);

create policy "profiles own upsert"
on profiles for insert
with check (auth.uid() = id);

create policy "profiles own update"
on profiles for update
using (auth.uid() = id);

create policy "listings public read"
on listings for select
using (true);

create policy "listings insert own"
on listings for insert
with check (auth.uid() = user_id);

create policy "listings update own"
on listings for update
using (auth.uid() = user_id);

create policy "listings delete own"
on listings for delete
using (auth.uid() = user_id);

create policy "comments public read"
on comments for select
using (true);

create policy "comments insert own"
on comments for insert
with check (auth.uid() = user_id);

create policy "reports public insert"
on reports for insert
with check (true);
