create extension if not exists pgcrypto;

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  page_type text not null,
  product_id uuid null,
  product_name text null,
  visitor_id text not null,
  user_agent text null,
  referrer text null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.page_views add column if not exists path text;
alter table public.page_views add column if not exists page_type text;
alter table public.page_views add column if not exists product_id uuid null;
alter table public.page_views add column if not exists product_name text null;
alter table public.page_views add column if not exists visitor_id text;
alter table public.page_views add column if not exists user_agent text null;
alter table public.page_views add column if not exists referrer text null;
alter table public.page_views add column if not exists created_at timestamptz not null default timezone('utc', now());

alter table public.page_views
  alter column path set not null,
  alter column page_type set not null,
  alter column visitor_id set not null,
  alter column created_at set default timezone('utc', now());

alter table public.page_views enable row level security;

drop policy if exists "Anon can insert page views" on public.page_views;
create policy "Anon can insert page views"
on public.page_views
for insert
to anon
with check (true);

drop policy if exists "Admin can read page views" on public.page_views;
create policy "Admin can read page views"
on public.page_views
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'xiaofengren2026@163.com');

create index if not exists idx_page_views_created_at on public.page_views (created_at desc);
create index if not exists idx_page_views_path on public.page_views (path);
create index if not exists idx_page_views_product_id on public.page_views (product_id);
create index if not exists idx_page_views_visitor_id on public.page_views (visitor_id);
