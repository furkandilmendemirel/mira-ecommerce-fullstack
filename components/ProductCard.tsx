"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "../lib/products";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  const chooseOptions = () => router.push(`/product/${product.id}`);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {product.oldPrice && <span className="sale-badge">İndirim</span>}
        <Link href={`/product/${product.id}`} aria-label={product.name}>
          <img src={product.image} alt={product.name} className="product-image" />
        </Link>
        <div className="product-card-actions">
          <button type="button" aria-label={`${product.name} favorilere ekle`}>
            <Heart size={18} />
          </button>
          <button
            type="button"
            aria-label={`${product.name} için seçenekleri belirle`}
            onClick={chooseOptions}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
      <div className="product-info">
        <span>{product.categoryLabel}</span>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
        <div className="price-row">
          <strong>{formatPrice(product.price)}</strong>
          {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
        </div>
      </div>
    </article>
  );
}
