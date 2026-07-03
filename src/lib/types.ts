export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  short_description: string | null;
  description: string | null;
  material: string | null;
  size: string | null;
  color: string | null;
  tags: string[];
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id?: string;
  brand_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_primary_button_text: string;
  hero_secondary_button_text: string;
  brand_intro_title: string;
  brand_intro_text: string;
  feature_1_title: string;
  feature_1_text: string;
  feature_2_title: string;
  feature_2_text: string;
  feature_3_title: string;
  feature_3_text: string;
  contact_email: string;
  instagram_url: string;
  kakao_url: string;
  whatsapp_url: string;
  footer_text: string;
  updated_at?: string;
};

export type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type FeatureItem = {
  title: string;
  text: string;
};

export type PageView = {
  id: string;
  path: string;
  page_type: string;
  product_id: string | null;
  product_name: string | null;
  visitor_id: string;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
};

export type AnalyticsTrendItem = {
  date: string;
  label: string;
  views: number;
};

export type AnalyticsTopPageItem = {
  path: string;
  page_type: string;
  views: number;
};

export type AnalyticsTopProductItem = {
  product_id: string | null;
  product_name: string | null;
  views: number;
};

export type AnalyticsSummary = {
  todayViews: number;
  totalViews: number;
  todayVisitors: number;
  totalVisitors: number;
  trend: AnalyticsTrendItem[];
  topPages: AnalyticsTopPageItem[];
  topProducts: AnalyticsTopProductItem[];
  recentVisits: PageView[];
};
