alter table public.products
add column if not exists category text default '东方好物';

update public.products
set category = '东方好物'
where category is null or category = '';

create index if not exists idx_products_category
on public.products(category);
