"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/site/product-card";
import { PRODUCT_EMPTY_MESSAGE } from "@/lib/constants";
import {
  PRODUCT_CATEGORY_FILTERS,
  PRODUCT_MATERIAL_FILTERS,
  type ProductCategoryFilter,
  type ProductMaterialFilter,
} from "@/lib/product-categories";
import type { Product } from "@/lib/types";

type ProductsCatalogProps = {
  title: string;
  products: Product[];
  id?: string;
};

export function ProductsCatalog({ title, products, id }: ProductsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryFilter>("全部");
  const [activeMaterial, setActiveMaterial] = useState<ProductMaterialFilter>("全部");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatched =
        activeCategory === "全部" || product.category.includes(activeCategory);
      const materialMatched =
        activeMaterial === "全部" || product.materials.includes(activeMaterial);

      return categoryMatched && materialMatched;
    });
  }, [activeCategory, activeMaterial, products]);

  return (
    <section id={id} className="container-shell mt-12 md:mt-20">
      <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">{title}</h2>

      <div className="hide-scrollbar mt-5 -mx-1 overflow-x-auto pb-1 md:mt-6">
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

      <div className="hide-scrollbar mt-3 -mx-1 overflow-x-auto pb-1 md:mt-4">
        <div className="flex min-w-max gap-3 px-1">
          {PRODUCT_MATERIAL_FILTERS.map((material) => {
            const isActive = material === activeMaterial;

            return (
              <button
                key={material}
                type="button"
                onClick={() => setActiveMaterial(material)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-accent bg-accent text-button-text shadow-[0_10px_24px_rgba(86,110,98,0.16)]"
                    : "border-border bg-white/14 text-foreground-muted hover:bg-white/24 hover:text-foreground"
                }`}
              >
                {material}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState title="暂无符合筛选条件的产品" description={PRODUCT_EMPTY_MESSAGE} />
          </div>
        )}
      </div>
    </section>
  );
}
