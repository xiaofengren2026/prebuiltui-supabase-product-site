import type { FeatureItem, SiteSettings } from "@/lib/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand_name: "青岚东方饰品",
  hero_title: "安静留白里的东方饰品展示",
  hero_subtitle:
    "以淡绿水墨的克制气质呈现手作饰品、幸运绳与小众东方美学产品，让每一件作品都被清楚而安静地看见。",
  hero_image: "",
  hero_primary_button_text: "查看产品",
  hero_secondary_button_text: "联系我们",
  brand_intro_title: "关于品牌",
  brand_intro_text:
    "我们希望把东方审美里的安静、克制与细节感，变成日常也能佩戴的作品。材质、配色与留白都尽量不过度张扬，让产品本身自然说话。",
  feature_1_title: "东方美学设计",
  feature_1_text: "从色调、材质到排版，保持安静克制的东方感。",
  feature_2_title: "手作质感",
  feature_2_text: "重视细节、触感与佩戴时的日常舒适度。",
  feature_3_title: "适合作为礼物",
  feature_3_text: "适合收藏、赠礼与日常搭配的小众配饰。",
  contact_email: "hello@example.com",
  instagram_url: "",
  kakao_url: "",
  whatsapp_url: "",
  footer_text: "以简净的东方气质，展示适合长期陈列与分享的手作饰品。",
};

export const SITE_NAV_ITEMS = [
  { label: "品牌", href: "/#brand" },
  { label: "推荐", href: "/#featured" },
  { label: "产品", href: "/#products" },
  { label: "联系", href: "/#contact" },
];

export const ADMIN_NAV_ITEMS = [
  { label: "后台首页", href: "/admin/dashboard" },
  { label: "产品管理", href: "/admin/products" },
  { label: "网站设置", href: "/admin/settings" },
];

export const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: DEFAULT_SITE_SETTINGS.feature_1_title,
    text: DEFAULT_SITE_SETTINGS.feature_1_text,
  },
  {
    title: DEFAULT_SITE_SETTINGS.feature_2_title,
    text: DEFAULT_SITE_SETTINGS.feature_2_text,
  },
  {
    title: DEFAULT_SITE_SETTINGS.feature_3_title,
    text: DEFAULT_SITE_SETTINGS.feature_3_text,
  },
];

export const PRODUCT_EMPTY_MESSAGE =
  "当前还没有已上架产品。你可以先去后台新增产品，前台会自动显示。";

export const SUPABASE_BUCKET = "product-images";
