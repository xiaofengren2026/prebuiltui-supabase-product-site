import Link from "next/link";
import { ArrowRight, Mail, MessageCircleMore, Sparkles } from "lucide-react";

import { ContactCards } from "@/components/site/contact-cards";
import { ProductCard } from "@/components/site/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { PRODUCT_EMPTY_MESSAGE } from "@/lib/constants";
import { getActiveProducts, getFeaturedProducts, getSiteSettings } from "@/lib/site-data";
import { buildFeatureList } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, featuredProducts, allProducts] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
    getActiveProducts(),
  ]);

  const features = buildFeatureList(settings);
  const contacts = [
    {
      label: "Email",
      value: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
    },
    {
      label: "Instagram",
      value: settings.instagram_url || "待填写 Instagram 链接",
      href: settings.instagram_url || "#",
    },
    {
      label: "Kakao",
      value: settings.kakao_url || "待填写 Kakao 链接",
      href: settings.kakao_url || "#",
    },
    {
      label: "WhatsApp",
      value: settings.whatsapp_url || "待填写 WhatsApp 链接",
      href: settings.whatsapp_url || "#",
    },
  ];

  return (
    <main className="pb-8">
      <section className="container-shell pt-8 md:pt-10">
        <div className="section-card subtle-grid grid overflow-hidden md:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 md:px-10 md:py-16">
            <span className="section-label">
              <Sparkles size={14} />
              东方淡绿水墨风产品站
            </span>
            <h1 className="text-balance mt-6 max-w-2xl font-serif text-4xl leading-tight text-foreground md:text-6xl">
              {settings.hero_title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-foreground-muted md:text-lg">
              {settings.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="primary-button">
                {settings.hero_primary_button_text}
                <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="secondary-button">
                {settings.hero_secondary_button_text}
              </Link>
            </div>
          </div>

          <div className="hero-ink relative min-h-[320px] overflow-hidden md:min-h-[560px]">
            <div className="absolute inset-0 p-6 md:p-8">
              <div className="h-full rounded-[28px] border border-white/20 bg-white/8 p-3 backdrop-blur-sm">
                <div className="h-full overflow-hidden rounded-[22px]">
                  <ResponsiveImage
                    src={settings.hero_image}
                    alt={settings.brand_name}
                    className="h-full w-full object-cover"
                    fallbackLabel="首页主图待上传"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="brand" className="container-shell mt-20">
        <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
          <div className="section-card px-6 py-8 md:px-8">
            <SectionHeading
              label="品牌介绍"
              title={settings.brand_intro_title}
              description={settings.brand_intro_text}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature, index) => (
              <article key={feature.title} className="section-card px-5 py-6">
                <p className="text-xs tracking-[0.14em] text-foreground-muted">
                  0{index + 1}
                </p>
                <h3 className="mt-4 font-serif text-2xl text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="container-shell mt-20">
        <SectionHeading
          label="推荐产品"
          title="精选展示区"
          description="优先展示后台设置为推荐的产品，让首页第一眼更集中、更有品牌节奏。"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState
                title="还没有推荐产品"
                description="去后台把产品标记为推荐后，这里会自动显示。"
              />
            </div>
          )}
        </div>
      </section>

      <section id="products" className="container-shell mt-20">
        <SectionHeading
          label="全部产品"
          title="按上架状态自动展示"
          description="前台只显示已上架产品，并按推荐优先、排序值和创建时间进行展示。"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {allProducts.length > 0 ? (
            allProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState title="暂无产品" description={PRODUCT_EMPTY_MESSAGE} />
            </div>
          )}
        </div>
      </section>

      <section className="container-shell mt-20">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="section-card px-5 py-6">
            <p className="section-label">东方美学设计</p>
            <p className="mt-5 text-sm leading-8 text-foreground-muted">
              从配色、材质到产品展示方式，保持安静、留白、克制的视觉秩序。
            </p>
          </article>
          <article className="section-card px-5 py-6">
            <p className="section-label">手作质感</p>
            <p className="mt-5 text-sm leading-8 text-foreground-muted">
              强调触感、佩戴感与细节层次，让每件作品都适合近距离展示。
            </p>
          </article>
          <article className="section-card px-5 py-6">
            <p className="section-label">适合作为礼物</p>
            <p className="mt-5 text-sm leading-8 text-foreground-muted">
              适合礼物、小众收藏和品牌陈列，不做复杂商城，只专注展示本身。
            </p>
          </article>
        </div>
      </section>

      <section id="contact" className="container-shell mt-20">
        <div className="section-card px-6 py-8 md:px-8">
          <SectionHeading
            label="联系方式"
            title="欢迎通过你常用的方式联系"
            description="这里的邮箱、社交链接和联系方式，都可以在后台网站设置页里直接修改。"
          />
          <div className="mt-8">
            <ContactCards items={contacts} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a href={`mailto:${settings.contact_email}`} className="primary-button">
              <Mail size={16} />
              发送邮件
            </a>
            <Link href={settings.whatsapp_url || "#"} className="secondary-button">
              <MessageCircleMore size={16} />
              WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
