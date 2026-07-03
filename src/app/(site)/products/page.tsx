import { ProductsSection } from "@/components/site/products-section";
import { getActiveProducts } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <main className="pb-8">
      <ProductsSection
        label="全部产品"
        title="完整产品目录"
        description="这里会自动显示后台已上架的产品，并按推荐优先和排序值展示。"
        products={products}
      />
    </main>
  );
}
