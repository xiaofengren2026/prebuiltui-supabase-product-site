import Link from "next/link";
import { Mail } from "lucide-react";
import { notFound } from "next/navigation";

import { PageViewTracker } from "@/components/site/page-view-tracker";
import { ProductGallery } from "@/components/site/product-gallery";
import { SectionHeading } from "@/components/site/section-heading";
import { getPublicProductBySlug, getSiteSettings } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getPublicProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const detailItems = [
    { label: "材质", value: product.material },
    { label: "尺寸", value: product.size },
    { label: "颜色", value: product.color },
  ].filter((item) => item.value);

  return (
    <main className="container-shell py-8 md:py-10">
      <PageViewTracker
        path={`/products/${product.slug}`}
        pageType="product_detail"
        productId={product.id}
        productName={product.name}
      />
      <Link href="/products" className="text-sm text-foreground-muted transition hover:text-foreground">
        返回产品列表
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery name={product.name} images={product.images} />

        <div className="grid gap-5">
          <div className="section-card px-6 py-8 md:px-8">
            <SectionHeading
              label={product.is_featured ? "推荐产品" : "产品详情"}
              title={product.name}
              description={product.short_description || ""}
            />
            <p className="mt-6 text-2xl font-semibold text-accent">
              {formatCurrency(product.price)}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-tag px-3 py-1 text-xs text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="section-card px-6 py-8 md:px-8">
            <h2 className="font-serif text-2xl text-foreground">详细描述</h2>
            <p className="mt-4 text-sm leading-8 text-foreground-muted">
              {product.description || "这件产品的更多细节、佩戴感和风格说明，可以在后台继续补充。"}
            </p>

            {detailItems.length > 0 ? (
              <div className="mt-6 grid gap-3">
                {detailItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between gap-3 border-t border-border/80 py-3 text-sm"
                  >
                    <span className="text-foreground-muted">{item.label}</span>
                    <span className="text-right text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="section-card px-6 py-8 md:px-8">
            <h2 className="font-serif text-2xl text-foreground">联系购买或咨询</h2>
            <p className="mt-4 text-sm leading-8 text-foreground-muted">
              当前站点只做产品展示，不包含购物车、支付、订单和物流。你可以通过联系方式直接咨询。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${settings.contact_email}`} className="primary-button">
                <Mail size={16} />
                邮件联系
              </a>
              <Link href="/contact" className="secondary-button">
                查看更多联系方式
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
