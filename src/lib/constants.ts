import type { FeatureItem, SiteSettings } from "@/lib/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand_name: "青岚东方美学",
  hero_title: "安静留白里的东方雅物展示",
  hero_subtitle:
    "以淡绿水墨气质呈现饰品、幸运绳与东方美学小物，让每一件作品都被清楚而安静地看见。",
  hero_image: "",
  hero_primary_button_text: "查看产品",
  hero_secondary_button_text: "联系我们",
  brand_intro_title: "品牌故事",
  brand_intro_text:
    "我们希望把东方审美里的安静、克制与细节感，变成日常也能佩戴与收藏的作品，让材质与线条自然说话。",
  feature_1_title: "东方意境设计",
  feature_1_text: "从色调、材质到留白，保持克制安静的东方气质。",
  feature_2_title: "好运随身佩戴",
  feature_2_text: "轻盈好搭配，也承载安定、顺遂与美好寓意。",
  feature_3_title: "轻手作礼赠之选",
  feature_3_text: "适合自留，也适合作为礼物传递温柔心意。",
  contact_email: "hello@example.com",
  instagram_url: "",
  kakao_url: "",
  whatsapp_url: "",
  footer_text: "以简净东方气质，展示适合长期陈列与分享的手作雅物。",
};

export const SITE_NAV_ITEMS = [
  { label: "品牌故事", href: "/#brand" },
  { label: "东方雅物", href: "/#products" },
  { label: "精选系列", href: "/#featured" },
  { label: "联系我们", href: "/#contact" },
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

export const PRODUCT_EMPTY_MESSAGE = "当前还没有已上架产品。";

export const SUPABASE_BUCKET = "product-images";
