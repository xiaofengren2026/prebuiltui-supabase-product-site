const PRIMARY_PRODUCT_CATEGORIES = ["手链", "项链", "耳饰", "戒指", "摆件", "东方好物"] as const;
const LEGACY_PRODUCT_CATEGORIES = ["手镯", "挂件", "其他"] as const;

export const PRODUCT_CATEGORIES = [
  ...PRIMARY_PRODUCT_CATEGORIES,
  ...LEGACY_PRODUCT_CATEGORIES,
] as const;

const PRIMARY_PRODUCT_MATERIALS = ["珍珠", "银饰", "水晶", "黄铜", "琉璃", "布艺"] as const;
const LEGACY_PRODUCT_MATERIALS = ["合金", "天然石", "编绳", "其他"] as const;

export const PRODUCT_MATERIALS = [
  ...PRIMARY_PRODUCT_MATERIALS,
  ...LEGACY_PRODUCT_MATERIALS,
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductMaterial = (typeof PRODUCT_MATERIALS)[number];

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "东方好物";
export const PRODUCT_CATEGORY_FILTERS = ["全部", ...PRIMARY_PRODUCT_CATEGORIES] as const;
export const PRODUCT_MATERIAL_FILTERS = ["全部", ...PRIMARY_PRODUCT_MATERIALS] as const;

export type ProductCategoryFilter = (typeof PRODUCT_CATEGORY_FILTERS)[number];
export type ProductMaterialFilter = (typeof PRODUCT_MATERIAL_FILTERS)[number];

export function normalizeProductCategory(value: string | null | undefined) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return DEFAULT_PRODUCT_CATEGORY;
  }

  return PRODUCT_CATEGORIES.includes(trimmedValue as ProductCategory)
    ? (trimmedValue as ProductCategory)
    : DEFAULT_PRODUCT_CATEGORY;
}

export function normalizeProductCategoryList(value: unknown) {
  if (Array.isArray(value)) {
    const normalized = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => normalizeProductCategory(item));

    return normalized.length > 0 ? Array.from(new Set(normalized)) : [DEFAULT_PRODUCT_CATEGORY];
  }

  if (typeof value === "string") {
    return [normalizeProductCategory(value)];
  }

  return [DEFAULT_PRODUCT_CATEGORY];
}

export function normalizeProductMaterialList(value: unknown, fallback?: string | null) {
  const list = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : typeof fallback === "string" && fallback.trim()
      ? fallback
          .split(/[、,]/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  return Array.from(
    new Set(
      list.filter((item) => PRODUCT_MATERIALS.includes(item as ProductMaterial)) as ProductMaterial[],
    ),
  );
}
