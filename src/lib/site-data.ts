import "server-only";

import { DEFAULT_SITE_SETTINGS } from "@/lib/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Product, SiteSettings } from "@/lib/types";
import { mapProductRowToProduct, mergeSettings } from "@/lib/utils";

const DEFAULT_BRAND_NAME = "青岚东方美学";

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
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
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
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProductRowToProduct(data);
}

export async function getAdminProducts() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapProductRowToProduct);
}

export async function getAdminProductById(id: string) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProductRowToProduct(data);
}
