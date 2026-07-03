alter table public.products
add column if not exists category text default '其他';

update public.products
set category = '其他'
where category is null or category = '';

create index if not exists idx_products_category
on public.products(category);
