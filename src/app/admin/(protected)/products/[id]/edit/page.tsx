import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { getAdminProductById } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">编辑产品</h2>
        <p className="mt-3 text-sm leading-7 text-foreground-muted">
          这里可以修改产品名称、描述、图片、推荐状态和排序。
        </p>
      </section>
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
