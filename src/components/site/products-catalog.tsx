"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/site/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { PRODUCT_EMPTY_MESSAGE } from "@/lib/constants";
import {
  DEFAULT_PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_FILTERS,
  type ProductCategoryFilter,
  normalizeProductCategory,
} from "@/lib/product-categories";
import type { Product } from "@/lib/types";

type ProductsCatalogProps = {
  label: string;
  title: string;
  description: string;
  products: Product[];
};

export function ProductsCatalog({
  label,
  title,
  description,
  products,
}: ProductsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryFilter>("全部");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "全部") {
      return products;
    }

    return products.filter(
      (product) =>
        normalizeProductCategory(product.category || DEFAULT_PRODUCT_CATEGORY) === activeCategory,
    );
  }, [activeCategory, products]);

  return (
    <section className="container-shell mt-20">
      <SectionHeading label={label} title={title} description={description} />

      <div className="mt-8 flex flex-wrap gap-3">
        {PRODUCT_CATEGORY_FILTERS.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-accent bg-accent text-button-text"
                  : "border-border bg-white/18 text-foreground hover:bg-white/28"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState title="暂无该分类产品" description={PRODUCT_EMPTY_MESSAGE} />
          </div>
        )}
      </div>
    </section>
  );
}
