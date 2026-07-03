export const PRODUCT_CATEGORIES = [
  "手链",
  "手镯",
  "戒指",
  "项链",
  "耳饰",
  "挂件",
  "其他",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "其他";

export const PRODUCT_CATEGORY_FILTERS = ["全部", ...PRODUCT_CATEGORIES] as const;

export type ProductCategoryFilter = (typeof PRODUCT_CATEGORY_FILTERS)[number];

export function normalizeProductCategory(value: string | null | undefined) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return DEFAULT_PRODUCT_CATEGORY;
  }

  return PRODUCT_CATEGORIES.includes(trimmedValue as ProductCategory)
    ? (trimmedValue as ProductCategory)
    : DEFAULT_PRODUCT_CATEGORY;
}
