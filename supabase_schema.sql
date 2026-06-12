-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Institutions Table
create table public.institutions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  "logoBase64" text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updatedAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Schedules Table
create table public.schedules (
  id uuid primary key default uuid_generate_v4(),
  "institutionId" uuid references public.institutions(id) on delete cascade not null,
  date text not null,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null,
  rows jsonb not null default '[]'::jsonb,
  "globalTarget" text,
  config jsonb
);

-- Settings Table (Single Row)
create table public.settings (
  id int primary key default 1 check (id = 1),
  "globalLogo" text,
  "siteTitle" text default 'Kayıt Planı',
  "siteFavicon" text,
  "updatedAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings row
insert into public.settings (id) values (1) on conflict do nothing;

-- Disable RLS for all tables so anyone can read/write (MVP without auth)
alter table public.institutions disable row level security;
alter table public.schedules disable row level security;
alter table public.settings disable row level security;
