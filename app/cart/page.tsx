"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  deleteCartItem,
  saveCartItem,
  updateCartItem,
} from "../../lib/cart-client";
import { toCartItems } from "../../lib/customer-data";
import {
  changeQuantity,
  getCartItemIdentity,
  getCartItemKey,
  hydrateCart,
  removeFromCart,
  type CartItem,
} from "../../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getColorLabel } from "../../lib/products";

const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const token = useAppSelector((state) => state.auth.token);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  const setQuantity = (item: CartItem, quantity: number) => {
    const safeQuantity = Math.max(1, quantity);
    dispatch(changeQuantity({ ...getCartItemIdentity(item), quantity: safeQuantity }));
    if (!token) return;

    const request = item.cartItemId
      ? updateCartItem(token, item.cartItemId, safeQuantity)
      : saveCartItem(
          token,
          item.product.id,
          safeQuantity,
          item.selectedSize,
          item.selectedColor,
        );
    void request.then((serverCart) =>
      dispatch(hydrateCart(toCartItems(serverCart))),
    );
  };

  const removeProduct = (item: CartItem) => {
    dispatch(removeFromCart(getCartItemIdentity(item)));
    if (token && item.cartItemId) void deleteCartItem(token, item.cartItemId);
  };

  if (items.length === 0) {
    return (
      <main className="empty-state page-shell">
        <ShoppingBag size={42} strokeWidth={1.4} />
        <span className="eyebrow">SEPETİN</span>
        <h1>Henüz biraz boş görünüyor.</h1>
        <p>Yeni sezon parçalarına göz at, favorilerini buraya ekle.</p>
        <Link href="/shop" className="primary-button">
          Alışverişe başla <ArrowRight size={17} />
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page page-shell">
      <div className="page-title">
        <span className="eyebrow">SEPET</span>
        <h1>Sepetindeki ürünler</h1>
        <p>{items.length} farklı seçenek seni bekliyor.</p>
      </div>
      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => {
            const { product, quantity, selectedSize, selectedColor } = item;
            const selectedImage = selectedColor
              ? product.colorImages?.[selectedColor] ?? product.image
              : product.image;

            return (
              <article className="cart-item" key={getCartItemKey(item)}>
                <img src={selectedImage} alt={product.name} />
                <div className="cart-item-copy">
                  <span>{product.categoryLabel}</span>
                  <Link href={`/product/${product.id}`}>{product.name}</Link>
                  {selectedSize && <small>Beden: {selectedSize}</small>}
                  {selectedColor && <small>Renk: {getColorLabel(selectedColor)}</small>}
                  <div className="cart-item-bottom">
                    <div className="quantity-control">
                      <button
                        type="button"
                        aria-label="Adedi azalt"
                        onClick={() => setQuantity(item, quantity - 1)}
                      >
                        <Minus size={15} />
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        aria-label="Adedi artır"
                        onClick={() => setQuantity(item, quantity + 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <strong>{money(product.price * quantity)}</strong>
                  </div>
                </div>
                <button
                  className="remove-item"
                  type="button"
                  aria-label={`${product.name} ürününü sil`}
                  onClick={() => removeProduct(item)}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            );
          })}
        </div>
        <aside className="order-summary">
          <h2>Sipariş özeti</h2>
          <div>
            <span>Ara toplam</span>
            <strong>{money(subtotal)}</strong>
          </div>
          <div>
            <span>Kargo</span>
            <strong>{shipping === 0 ? "Ücretsiz" : money(shipping)}</strong>
          </div>
          <label>
            İndirim kodu
            <span>
              <input placeholder="Kodunu yaz" />
              <button type="button">Uygula</button>
            </span>
          </label>
          <div className="summary-total">
            <span>Toplam</span>
            <strong>{money(total)}</strong>
          </div>
          <Link href="/checkout" className="primary-button">
            Siparişi tamamla <ArrowRight size={17} />
          </Link>
          <small>Güvenli ödeme · 30 gün içinde kolay iade</small>
        </aside>
      </div>
    </main>
  );
}
