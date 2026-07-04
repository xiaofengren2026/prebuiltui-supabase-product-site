alter table public.products
add column if not exists materials text[] not null default '{}';

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'category'
  ) then
    alter table public.products
    add column category text[] not null default array[U&'\5176\4ED6']::text[];
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'category'
      and data_type <> 'ARRAY'
  ) then
    alter table public.products
    alter column category type text[]
    using case
      when category is null or btrim(category) = '' then array[U&'\5176\4ED6']::text[]
      else array[category]::text[]
    end;
  end if;
end $$;

alter table public.products
alter column category set default array[U&'\5176\4ED6']::text[];

update public.products
set category = array[U&'\5176\4ED6']::text[]
where category is null or cardinality(category) = 0;

update public.products
set materials = case
  when material is null or btrim(material) = '' then '{}'
  else array[material]::text[]
end
where materials is null or cardinality(materials) = 0;

create index if not exists idx_products_category_gin
on public.products using gin(category);

create index if not exists idx_products_materials_gin
on public.products using gin(materials);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  product_id uuid,
  product_name text not null,
  price numeric(10, 2) not null default 0,
  category text[] not null default '{}',
  materials text[] not null default '{}',
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  note text,
  payment_status text not null default U&'\672A\4ED8\6B3E',
  shipping_status text not null default U&'\672A\53D1\8D27',
  payment_method text not null default 'pending',
  payment_id text,
  tracking_company text,
  tracking_number text,
  admin_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.orders
add column if not exists payment_method text not null default 'pending';

alter table public.orders
add column if not exists payment_id text;

update public.orders
set payment_method = 'pending'
where payment_method is null or btrim(payment_method) = '';

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

alter table public.orders enable row level security;

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders
for insert
with check (true);

drop policy if exists "Admin can manage orders" on public.orders;
create policy "Admin can manage orders"
on public.orders
for all
using ((auth.jwt() ->> 'email') = 'xiaofengren2026@163.com')
with check ((auth.jwt() ->> 'email') = 'xiaofengren2026@163.com');

create index if not exists idx_orders_created_at
on public.orders(created_at desc);

create index if not exists idx_orders_payment_status
on public.orders(payment_status);

create index if not exists idx_orders_shipping_status
on public.orders(shipping_status);
