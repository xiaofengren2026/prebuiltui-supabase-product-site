"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/site/product-card";
import { PRODUCT_EMPTY_MESSAGE } from "@/lib/constants";
import {
  DEFAULT_PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_FILTERS,
  type ProductCategoryFilter,
  normalizeProductCategory,
} from "@/lib/product-categories";
import type { Product } from "@/lib/types";

type ProductsCatalogProps = {
  title: string;
  products: Product[];
  id?: string;
};

export function ProductsCatalog({ title, products, id }: ProductsCatalogProps) {
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
    <section id={id} className="container-shell mt-16 md:mt-20">
      <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">{title}</h2>

      <div className="mt-6 -mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-3 px-1">
          {PRODUCT_CATEGORY_FILTERS.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-accent bg-accent text-button-text shadow-[0_10px_24px_rgba(86,110,98,0.16)]"
                    : "border-border bg-white/18 text-foreground hover:bg-white/28"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
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
