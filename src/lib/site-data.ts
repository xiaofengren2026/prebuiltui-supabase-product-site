import "server-only";

import { DEFAULT_SITE_SETTINGS } from "@/lib/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Order, Product, SiteSettings } from "@/lib/types";
import { mapOrderRowToOrder, mapProductRowToProduct, mergeSettings } from "@/lib/utils";

const DEFAULT_BRAND_NAME = "青岚东方美学";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-bracelet-1",
    name: "青岚珍珠手链",
    slug: "qinglan-pearl-bracelet",
    price: 68,
    category: ["手链"],
    materials: ["珍珠", "银饰"],
    short_description: "温润珍珠与细银点缀，适合日常佩戴与轻礼赠送。",
    description:
      "以克制的东方留白感呈现珍珠与银饰的轻盈组合，适合叠戴，也适合作为入门款东方雅物。",
    material: "珍珠、银饰",
    size: "可调节",
    color: "珠白 / 银灰",
    tags: ["东方美学", "轻礼物", "日常佩戴"],
    images: [],
    is_active: true,
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-necklace-1",
    name: "流光琉璃项链",
    slug: "liuguang-liuli-necklace",
    price: 96,
    category: ["项链"],
    materials: ["琉璃", "黄铜"],
    short_description: "琉璃光泽与黄铜细节相映，低调里带一点灵动。",
    description:
      "以琉璃的通透感搭配黄铜配件，整体线条克制轻盈，适合单独佩戴，也适合作为东方轻礼。",
    material: "琉璃、黄铜",
    size: "45cm",
    color: "雾青金",
    tags: ["琉璃", "东方雅物", "低调质感"],
    images: [],
    is_active: true,
    is_featured: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function getMockProducts() {
  return MOCK_PRODUCTS;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      ...DEFAULT_SITE_SETTINGS,
      brand_name: DEFAULT_BRAND_NAME,
    };
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      ...DEFAULT_SITE_SETTINGS,
      brand_name: DEFAULT_BRAND_NAME,
    };
  }

  return mergeSettings(
    {
      ...DEFAULT_SITE_SETTINGS,
      brand_name: DEFAULT_BRAND_NAME,
    },
    data ?? undefined,
  );
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return getMockProducts().filter((product) => product.is_active);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return getMockProducts().filter((product) => product.is_active);
  }

  return data.map(mapProductRowToProduct);
}

export async function getFeaturedProducts() {
  const products = await getActiveProducts();
  return products.filter((product) => product.is_featured);
}

export async function getPublicProductBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return getMockProducts().find((product) => product.slug === slug && product.is_active) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return getMockProducts().find((product) => product.slug === slug && product.is_active) ?? null;
  }

  return mapProductRowToProduct(data);
}

export async function getAdminProducts() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return getMockProducts();
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return getMockProducts();
  }

  return data.map(mapProductRowToProduct);
}

export async function getAdminProductById(id: string) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return getMockProducts().find((product) => product.id === id) ?? null;
  }

  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    return getMockProducts().find((product) => product.id === id) ?? null;
  }

  return mapProductRowToProduct(data);
}

export async function getAdminOrders(): Promise<Order[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapOrderRowToOrder);
}
