import Link from "next/link";

import { ResponsiveImage } from "@/components/shared/responsive-image";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group section-card flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1"
    >
      <div className="h-[260px] overflow-hidden">
        <ResponsiveImage
          src={product.images[0]}
          alt={product.name}
          className="transition duration-500 group-hover:scale-[1.03]"
          fallbackLabel="产品图片待上传"
        />
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-2xl text-foreground">{product.name}</h3>
          <span className="text-sm font-semibold text-accent">
            {formatCurrency(product.price)}
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-7 text-foreground-muted">
          {product.short_description || "以克制留白承托产品本身，让细节更容易被看见。"}
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
