import Link from "next/link";
import { ArrowRight, Mail, MessageCircleMore, Sparkles } from "lucide-react";

import { ContactCards } from "@/components/site/contact-cards";
import { ProductCard } from "@/components/site/product-card";
import { ProductsCatalog } from "@/components/site/products-catalog";
import { SectionHeading } from "@/components/site/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { getActiveProducts, getFeaturedProducts, getSiteSettings } from "@/lib/site-data";
import { buildFeatureList } from "@/lib/utils";

export const dynamic = "force-dynamic";

const mobileFeatureTitles = ["东方意境设计", "好运随身佩戴", "轻手作礼赠之选"];
const mobileFeatureTexts = ["东方留白，安静耐看", "轻盈佩戴，寓意温和", "适合赠礼，也适合收藏"];

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
      value: settings.instagram_url || "待补充 Instagram 链接",
      href: settings.instagram_url || "#",
    },
    {
      label: "Kakao",
      value: settings.kakao_url || "待补充 Kakao 链接",
      href: settings.kakao_url || "#",
    },
    {
      label: "WhatsApp",
      value: settings.whatsapp_url || "待补充 WhatsApp 链接",
      href: settings.whatsapp_url || "#",
    },
  ];

  return (
    <main className="pb-8">
      <section className="container-shell pt-4 md:pt-10">
        <div className="section-card subtle-grid grid overflow-hidden md:grid-cols-[1.1fr_0.9fr]">
          <div className="px-5 py-8 md:px-10 md:py-16">
            <span className="section-label">
              <Sparkles size={14} />
              东方淡绿水墨风产品站
            </span>
            <h1 className="text-balance mt-4 max-w-2xl font-serif text-3xl leading-tight text-foreground md:mt-6 md:text-6xl">
              {settings.hero_title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-foreground-muted md:mt-6 md:text-lg md:leading-8">
              {settings.hero_subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
              <Link
                href="/products"
                className="primary-button px-4 py-2.5 text-sm md:px-6 md:py-3.5 md:text-base"
              >
                {settings.hero_primary_button_text}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/#contact"
                className="secondary-button px-4 py-2.5 text-sm md:px-6 md:py-3.5 md:text-base"
              >
                {settings.hero_secondary_button_text}
              </Link>
            </div>
          </div>

          <div className="hero-ink relative min-h-[220px] overflow-hidden md:min-h-[560px]">
            <div className="absolute inset-0 p-4 md:p-8">
              <div className="h-full rounded-[24px] border border-white/20 bg-white/8 p-2.5 backdrop-blur-sm md:rounded-[28px] md:p-3">
                <div className="h-full overflow-hidden rounded-[18px] md:rounded-[22px]">
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

      <section id="brand" className="container-shell mt-12 md:mt-20">
        <div className="grid gap-4 md:gap-6 md:grid-cols-[0.95fr_1.05fr]">
          <div className="section-card px-5 py-6 md:px-8 md:py-8">
            <SectionHeading
              label="品牌故事"
              title={settings.brand_intro_title}
              description={settings.brand_intro_text}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {features.slice(0, 3).map((feature, index) => (
              <article key={feature.title} className="section-card px-4 py-4 md:px-5 md:py-5">
                <p className="text-[10px] tracking-[0.12em] text-foreground-muted md:text-[11px]">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-serif text-[15px] leading-5 text-foreground md:mt-3 md:text-xl">
                  <span className="md:hidden">{mobileFeatureTitles[index] ?? feature.title}</span>
                  <span className="hidden md:inline">{feature.title}</span>
                </h3>
                <p className="mt-1 text-xs leading-5 text-foreground-muted md:mt-2 md:text-xs md:leading-6">
                  <span className="line-clamp-1 md:hidden">
                    {mobileFeatureTexts[index] ?? feature.text}
                  </span>
                  <span className="line-clamp-1 hidden md:inline">{feature.text}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProductsCatalog id="products" title="东方雅物" products={allProducts} />

      <section id="featured" className="container-shell mt-14 md:mt-20">
        <SectionHeading
          label="精选系列"
          title="推荐产品展示"
          description="这里只展示后台设置为推荐的产品，不放分类筛选，让重点作品更集中。"
        />
        <div className="mt-6 grid gap-4 md:mt-8 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
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

      <section id="contact" className="container-shell mt-14 md:mt-20">
        <div className="section-card px-6 py-8 md:px-8">
          <SectionHeading
            label="联系我们"
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
