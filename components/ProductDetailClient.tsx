"use client";

import { Check, Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { saveCartItem } from "../lib/cart-client";
import { toCartItems } from "../lib/customer-data";
import { getColorLabel, getProductSizes, type Product } from "../lib/products";
import { addToCart, hydrateCart } from "../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductDetailClient({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const currentQuantity = useAppSelector(
    (state) =>
      state.cart.items.find(
        (item) =>
          item.product.id === product.id &&
          (item.selectedSize ?? "") === (selectedSize ?? "") &&
          (item.selectedColor ?? "") === (selectedColor ?? ""),
      )?.quantity ?? 0,
  );
  const sizeOptions = getProductSizes(product);
  const sizeRequired = sizeOptions.length > 0;
  const colorRequired = product.colors.length > 0;
  const displayedImage = selectedColor
    ? product.colorImages?.[selectedColor] ?? product.image
    : product.image;
  const selectionMissing =
    (colorRequired && !selectedColor) || (sizeRequired && !selectedSize);

  const addProduct = () => {
    if (selectionMissing) return;
    for (let index = 0; index < quantity; index += 1) {
      dispatch(addToCart({ product, selectedSize, selectedColor }));
    }
    if (token) {
      void saveCartItem(
        token,
        product.id,
        Math.min(99, currentQuantity + quantity),
        selectedSize,
        selectedColor,
      ).then((serverCart) => dispatch(hydrateCart(toCartItems(serverCart))));
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="product-detail page-shell">
      <div className="product-gallery">
        <img
          key={displayedImage}
          src={displayedImage}
          alt={`${product.name}${selectedColor ? ` - ${getColorLabel(selectedColor)}` : ""}`}
        />
      </div>
      <div className="product-detail-copy">
        <span className="eyebrow">{product.categoryLabel}</span>
        <h1>{product.name}</h1>
        <div className="rating">
          <Star size={17} fill="currentColor" />
          <strong>{product.rating}</strong>
          <span>{product.reviews} değerlendirme</span>
        </div>
        <div className="detail-price">
          <strong>{formatPrice(product.price)}</strong>
          {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
        </div>
        <p>{product.description}</p>
        <div className="detail-group">
          <span>Renk</span>
          <div className="swatches">
            {product.colors.map((color) => (
              <button
                type="button"
                aria-label={`${getColorLabel(color)} rengini seç`}
                aria-pressed={selectedColor === color}
                className={selectedColor === color ? "selected" : ""}
                key={color}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          {!selectedColor && (
            <small className="selection-hint">Sepete eklemek için renk seç.</small>
          )}
        </div>
        {sizeRequired && (
          <div className="detail-group">
            <span>Beden</span>
            <div className="sizes">
              {sizeOptions.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={selectedSize === size ? "selected" : ""}
                  aria-pressed={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <small className="selection-hint">Sepete eklemek için beden seç.</small>
            )}
          </div>
        )}
        <div className="add-row">
          <div className="quantity-control">
            <button
              type="button"
              aria-label="Adedi azalt"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label="Adedi artır"
              onClick={() => setQuantity((value) => value + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            className="primary-button add-cart"
            type="button"
            onClick={addProduct}
            disabled={selectionMissing}
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
            {added
              ? "Sepete eklendi"
              : colorRequired && !selectedColor
                ? "Önce renk seç"
                : sizeRequired && !selectedSize
                  ? "Önce beden seç"
                  : "Sepete ekle"}
          </button>
          <button className="favorite-button" type="button" aria-label="Favorilere ekle">
            <Heart size={20} />
          </button>
        </div>
        <div className="detail-notes">
          <div>
            <Check size={16} /> 1–3 iş gününde kargoda
          </div>
          <div>
            <Check size={16} /> 30 gün içinde ücretsiz iade
          </div>
        </div>
      </div>
    </main>
  );
}
