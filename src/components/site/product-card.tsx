import Link from "next/link";

import { ResponsiveImage } from "@/components/shared/responsive-image";
import { DEFAULT_PRODUCT_CATEGORY, normalizeProductCategory } from "@/lib/product-categories";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const category = normalizeProductCategory(product.category[0] || DEFAULT_PRODUCT_CATEGORY);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group section-card flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1"
    >
      <div className="h-[220px] overflow-hidden md:h-[260px]">
        <ResponsiveImage
          src={product.images[0]}
          alt={product.name}
          className="transition duration-500 group-hover:scale-[1.03]"
          fallbackLabel="产品图片待上传"
          loading="lazy"
          width={640}
          quality={76}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 py-4 md:px-5 md:py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 md:space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-border bg-tag px-3 py-1 text-xs text-foreground">
                {category}
              </span>
              {product.materials[0] ? (
                <span className="inline-flex rounded-full border border-border bg-white/16 px-3 py-1 text-xs text-foreground-muted">
                  {product.materials[0]}
                </span>
              ) : null}
            </div>
            <h3 className="font-serif text-xl text-foreground md:text-2xl">{product.name}</h3>
          </div>

          <span className="text-sm font-semibold text-accent">{formatCurrency(product.price)}</span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-foreground-muted md:leading-7">
          {product.short_description || "以克制留白承托作品本身，让细节自然被看见。"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-tag px-3 py-1 text-xs text-foreground"
            >
              {tag}
            </span>
          ))}
          {product.is_featured ? (
            <span className="rounded-full border border-border bg-accent-soft px-3 py-1 text-xs text-accent">
              推荐
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
