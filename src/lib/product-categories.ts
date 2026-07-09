const PRODUCT_CATEGORY_OPTIONS = ["手链", "项链", "耳饰", "戒指", "扇子", "其他小饰"] as const;
const PRODUCT_MATERIAL_OPTIONS = ["珍珠", "银饰", "水晶", "编绳", "其他"] as const;

const LEGACY_CATEGORY_ALIASES: Record<string, (typeof PRODUCT_CATEGORY_OPTIONS)[number]> = {
  东方好物: "其他小饰",
  手镯: "其他小饰",
  挂件: "其他小饰",
  摆件: "扇子",
  其他: "其他小饰",
};

const LEGACY_MATERIAL_ALIASES: Record<string, (typeof PRODUCT_MATERIAL_OPTIONS)[number]> = {
  黄铜: "其他",
  琉璃: "其他",
  布艺: "其他",
  合金: "其他",
  天然石: "其他",
};

export const PRODUCT_CATEGORIES = PRODUCT_CATEGORY_OPTIONS;
export const PRODUCT_MATERIALS = PRODUCT_MATERIAL_OPTIONS;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductMaterial = (typeof PRODUCT_MATERIALS)[number];

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "其他小饰";
export const PRODUCT_CATEGORY_FILTERS = ["全部", ...PRODUCT_CATEGORY_OPTIONS] as const;
export const PRODUCT_MATERIAL_FILTERS = ["全部", ...PRODUCT_MATERIAL_OPTIONS] as const;

export type ProductCategoryFilter = (typeof PRODUCT_CATEGORY_FILTERS)[number];
export type ProductMaterialFilter = (typeof PRODUCT_MATERIAL_FILTERS)[number];

export function normalizeProductCategory(value: string | null | undefined) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return DEFAULT_PRODUCT_CATEGORY;
  }

  if (PRODUCT_CATEGORIES.includes(trimmedValue as ProductCategory)) {
    return trimmedValue as ProductCategory;
  }

  return LEGACY_CATEGORY_ALIASES[trimmedValue] ?? DEFAULT_PRODUCT_CATEGORY;
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

function normalizeProductMaterial(value: string | null | undefined) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return null;
  }

  if (PRODUCT_MATERIALS.includes(trimmedValue as ProductMaterial)) {
    return trimmedValue as ProductMaterial;
  }

  return LEGACY_MATERIAL_ALIASES[trimmedValue] ?? "其他";
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

  const normalized = list
    .map((item) => normalizeProductMaterial(item))
    .filter((item): item is ProductMaterial => Boolean(item));

  return Array.from(new Set(normalized));
}
