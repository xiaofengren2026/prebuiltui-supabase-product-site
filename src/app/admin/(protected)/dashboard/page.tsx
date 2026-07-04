import Link from "next/link";
import { Package, Settings, Sparkles } from "lucide-react";

import { getAdminProducts, getSiteSettings } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, settings] = await Promise.all([getAdminProducts(), getSiteSettings()]);
  const activeCount = products.filter((product) => product.is_active).length;
  const featuredCount = products.filter((product) => product.is_featured).length;

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="section-card px-5 py-6">
          <Package className="text-accent" size={18} />
          <p className="mt-4 text-sm text-foreground-muted">总产品数</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{products.length}</p>
        </article>
        <article className="section-card px-5 py-6">
          <Sparkles className="text-accent" size={18} />
          <p className="mt-4 text-sm text-foreground-muted">已上架产品</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{activeCount}</p>
        </article>
        <article className="section-card px-5 py-6">
          <Settings className="text-accent" size={18} />
          <p className="mt-4 text-sm text-foreground-muted">推荐产品</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{featuredCount}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="section-card px-6 py-6">
          <h2 className="font-serif text-2xl text-foreground">快捷入口</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/products/new" className="primary-button">
              新增产品
            </Link>
            <Link href="/admin/products" className="secondary-button">
              查看产品列表
            </Link>
            <Link href="/admin/orders" className="secondary-button">
              查看订单
            </Link>
            <Link href="/admin/settings" className="secondary-button">
              修改网站设置
            </Link>
          </div>
        </article>

        <article className="section-card px-6 py-6">
          <h2 className="font-serif text-2xl text-foreground">当前品牌名</h2>
          <p className="mt-4 text-lg text-foreground">{settings.brand_name}</p>
          <p className="mt-3 text-sm leading-7 text-foreground-muted">
            首页主标题、品牌介绍和联系方式都可以在网站设置中直接修改。
          </p>
        </article>
      </section>
    </div>
  );
}
