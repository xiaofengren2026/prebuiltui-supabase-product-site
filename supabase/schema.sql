create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price numeric(10, 2) not null default 0,
  short_description text,
  description text,
  material text,
  size text,
  color text,
  tags text[] not null default '{}',
  images jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text,
  hero_title text,
  hero_subtitle text,
  hero_image text,
  hero_primary_button_text text,
  hero_secondary_button_text text,
  brand_intro_title text,
  brand_intro_text text,
  feature_1_title text,
  feature_1_text text,
  feature_2_title text,
  feature_2_text text,
  feature_3_title text,
  feature_3_text text,
  contact_email text,
  instagram_url text,
  kakao_url text,
  whatsapp_url text,
  footer_text text,
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products
for select
using (is_active = true);

drop policy if exists "Admin can manage products" on public.products;
create policy "Admin can manage products"
on public.products
for all
using ((auth.jwt() ->> 'email') = 'xiaofengren2026@163.com')
with check ((auth.jwt() ->> 'email') = 'xiaofengren2026@163.com');

drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
on public.site_settings
for select
using (true);

drop policy if exists "Admin can manage site settings" on public.site_settings;
create policy "Admin can manage site settings"
on public.site_settings
for all
using ((auth.jwt() ->> 'email') = 'xiaofengren2026@163.com')
with check ((auth.jwt() ->> 'email') = 'xiaofengren2026@163.com');
