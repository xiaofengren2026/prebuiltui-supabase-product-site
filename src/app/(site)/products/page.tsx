import { ProductsCatalog } from "@/components/site/products-catalog";
import { getActiveProducts } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <main className="pb-8">
      <ProductsCatalog title="东方雅物" products={products} />
    </main>
  );
}
