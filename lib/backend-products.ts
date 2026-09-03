import type { Category, Product } from "./products";

export type BackendImage = { url: string; index: number };

export type BackendProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_code: string;
  category_title: string;
  rating: number;
  sell_count: number;
  images: BackendImage[];
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string>;
};

export type BackendProductPage = {
  products: BackendProduct[];
  total: number;
};

const categoryColors: Record<Category, string[]> = {
  women: ["#c9ad8b", "#202124", "#ded6cb"],
  men: ["#22252a", "#816d5d", "#52604f"],
  accessories: ["#d1b36d", "#151515", "#bbc0c4"],
};

const asCategory = (value: string): Category => {
  if (value === "men" || value === "accessories") return value;
  return "women";
};

export const toFrontendProduct = (product: BackendProduct): Product => {
  const category = asCategory(product.category_code);
  const colors = product.colors?.length ? product.colors : categoryColors[category];
  const colorImages = product.colorImages ?? {};
  const firstVariantImage = colors.map((color) => colorImages[color]).find(Boolean);

  return {
    id: product.id,
    name: product.name,
    category,
    categoryLabel: product.category_title,
    price: Number(product.price),
    rating: Number(product.rating),
    reviews: product.sell_count,
    image: firstVariantImage ??
      product.images[0]?.url ?? "https://placehold.co/900x1200?text=MIRA",
    colors,
    colorImages,
    sizes: product.sizes,
    description: product.description,
    featured: product.sell_count >= 80,
  };
};

export const backendSort = (sort: string) => {
  if (sort === "price-asc") return "price:asc";
  if (sort === "price-desc") return "price:desc";
  return "rating:desc";
};
