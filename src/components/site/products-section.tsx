import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/site/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { PRODUCT_EMPTY_MESSAGE } from "@/lib/constants";
import type { Product } from "@/lib/types";

type ProductsSectionProps = {
  label: string;
  title: string;
  description: string;
  products: Product[];
  id?: string;
};

export function ProductsSection({
  label,
  title,
  description,
  products,
  id,
}: ProductsSectionProps) {
  return (
    <section id={id} className="container-shell mt-20">
      <SectionHeading label={label} title={title} description={description} />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState title="暂无产品" description={PRODUCT_EMPTY_MESSAGE} />
          </div>
        )}
      </div>
    </section>
  );
}
