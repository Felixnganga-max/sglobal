// Must match the `category` enum on the backend Product model
// (server/models/productModel.js) exactly.
export const PRODUCT_CATEGORIES = [
  "Craft cooked potato chips",
  "Just fruits",
  "Hazelnuts",
  "Hum Hum",
  "Cakemix",
  "Brownie & Pancake",
  "Whipped creams",
  "Boringer topping sauces",
  "Kent soups",
  "Kent stocks",
  "Kent syrups",
  "Kent sauces",
  "Kent spreads",
  "Water",
];

// URL-safe slug for a category, used to deep-link from anywhere on the
// site straight into that category's section on the Products page
// (e.g. "Kent soups" -> "kent-soups" -> /products#cat-kent-soups).
export function categorySlug(category) {
  return (category || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function categoryAnchor(category) {
  return `cat-${categorySlug(category)}`;
}
