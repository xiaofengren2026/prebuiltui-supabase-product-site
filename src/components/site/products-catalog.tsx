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
    <section className="container-shell mt-16 md:mt-20">
      <SectionHeading label={label} title={title} description={description} />

      <div className="mt-8 rounded-[2rem] border border-border bg-white/16 p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground-muted">
              Category Filter
            </p>
            <h2 className="mt-2 font-serif text-2xl text-foreground">按分类浏览产品</h2>
            <p className="mt-2 text-sm leading-7 text-foreground-muted">
              默认显示全部产品，点击分类后会立即筛选当前系列。
            </p>
          </div>

          <div className="rounded-full border border-border bg-white/20 px-4 py-2 text-sm text-foreground-muted">
            当前分类：<span className="text-foreground">{activeCategory}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {PRODUCT_CATEGORY_FILTERS.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-accent bg-accent text-button-text shadow-[0_12px_30px_rgba(86,110,98,0.18)]"
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
