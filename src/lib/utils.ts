import { clsx } from "clsx";

import { DEFAULT_PRODUCT_CATEGORY, normalizeProductCategory } from "@/lib/product-categories";
import type { ContactItem, Product, SiteSettings } from "@/lib/types";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function splitTextList(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinTextList(input: string[] | null | undefined) {
  return (input ?? []).join(", ");
}

export function normalizeImageList(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((item): item is string => typeof item === "string");
}

export function mapProductRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    price: Number(row.price ?? 0),
    category: normalizeProductCategory(
      typeof row.category === "string" ? row.category : DEFAULT_PRODUCT_CATEGORY,
    ),
    short_description:
      typeof row.short_description === "string" ? row.short_description : null,
    description: typeof row.description === "string" ? row.description : null,
    material: typeof row.material === "string" ? row.material : null,
    size: typeof row.size === "string" ? row.size : null,
    color: typeof row.color === "string" ? row.color : null,
    tags: Array.isArray(row.tags)
      ? row.tags.filter((item): item is string => typeof item === "string")
      : [],
    images: normalizeImageList(row.images),
    is_active: Boolean(row.is_active),
    is_featured: Boolean(row.is_featured),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export function mergeSettings(
  defaults: SiteSettings,
  row: Record<string, unknown> | null | undefined,
): SiteSettings {
  if (!row) {
    return defaults;
  }

  return {
    ...defaults,
    ...Object.fromEntries(
      Object.entries(row).filter(([, value]) => value !== null && value !== undefined),
    ),
  };
}

export function buildFeatureList(settings: SiteSettings) {
  return [
    {
      title: settings.feature_1_title,
      text: settings.feature_1_text,
    },
    {
      title: settings.feature_2_title,
      text: settings.feature_2_text,
    },
    {
      title: settings.feature_3_title,
      text: settings.feature_3_text,
    },
  ].filter((item) => item.title || item.text);
}

function isValidEmail(value: string | null | undefined) {
  return Boolean(value?.trim() && value.includes("@"));
}

function isValidAbsoluteUrl(value: string | null | undefined) {
  if (!value?.trim()) {
    return false;
  }

  return /^https?:\/\//i.test(value.trim());
}

export function buildContactItems(settings: SiteSettings): ContactItem[] {
  return [
    {
      label: "Email",
      value: settings.contact_email || "待补充邮箱",
      href: isValidEmail(settings.contact_email) ? `mailto:${settings.contact_email}` : undefined,
    },
    {
      label: "Instagram",
      value: settings.instagram_url || "待补充 Instagram 链接",
      href: isValidAbsoluteUrl(settings.instagram_url) ? settings.instagram_url : undefined,
    },
    {
      label: "Kakao",
      value: settings.kakao_url || "待补充 Kakao 链接",
      href: isValidAbsoluteUrl(settings.kakao_url) ? settings.kakao_url : undefined,
    },
    {
      label: "WhatsApp",
      value: settings.whatsapp_url || "待补充 WhatsApp 链接",
      href: isValidAbsoluteUrl(settings.whatsapp_url) ? settings.whatsapp_url : undefined,
    },
  ];
}

export function toProductFormValues(product?: Product | null) {
  return {
    name: product?.name ?? "",
    price: product?.price ? String(product.price) : "",
    category: normalizeProductCategory(product?.category),
    short_description: product?.short_description ?? "",
    description: product?.description ?? "",
    material: product?.material ?? "",
    size: product?.size ?? "",
    color: product?.color ?? "",
    tags: joinTextList(product?.tags),
    images: product?.images ?? [],
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    sort_order: String(product?.sort_order ?? 0),
  };
}

export function toSettingsFormValues(settings: SiteSettings) {
  return {
    brand_name: settings.brand_name,
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    hero_image: settings.hero_image,
    hero_primary_button_text: settings.hero_primary_button_text,
    hero_secondary_button_text: settings.hero_secondary_button_text,
    brand_intro_title: settings.brand_intro_title,
    brand_intro_text: settings.brand_intro_text,
    feature_1_title: settings.feature_1_title,
    feature_1_text: settings.feature_1_text,
    feature_2_title: settings.feature_2_title,
    feature_2_text: settings.feature_2_text,
    feature_3_title: settings.feature_3_title,
    feature_3_text: settings.feature_3_text,
    contact_email: settings.contact_email,
    instagram_url: settings.instagram_url,
    kakao_url: settings.kakao_url,
    whatsapp_url: settings.whatsapp_url,
    footer_text: settings.footer_text,
  };
}
