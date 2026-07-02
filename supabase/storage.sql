insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Admin can upload product images" on storage.objects;
create policy "Admin can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'xiaofengren2026@163.com'
);

drop policy if exists "Admin can update product images" on storage.objects;
create policy "Admin can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'xiaofengren2026@163.com'
)
with check (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'xiaofengren2026@163.com'
);

drop policy if exists "Admin can delete product images" on storage.objects;
create policy "Admin can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'xiaofengren2026@163.com'
);
