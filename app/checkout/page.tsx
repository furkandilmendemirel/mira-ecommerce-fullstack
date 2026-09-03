"use client";

import Link from "next/link";
import { Check, CreditCard, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { clearCart, getCartItemKey } from "../../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getColorLabel } from "../../lib/products";

const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [step, setStep] = useState<1 | 2>(1);
  const [address, setAddress] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const total = subtotal + (subtotal >= 1500 ? 0 : 79);

  const saveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setAddress(data as Record<string, string>);
    setStep(2);
  };

  const completeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      router.push("/login");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingAddress: address.address,
          shippingCity: address.city,
          shippingDistrict: address.district,
        }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(result.message ?? "Sipariş oluşturulamadı.");
        setSubmitting(false);
        return;
      }

      dispatch(clearCart());
      router.push("/account?order=success");
    } catch {
      setError("Backend bağlantısı kurulamadı. Lütfen tekrar dene.");
      setSubmitting(false);
    }
  };

  if (hydrated && !token) {
    return (
      <main className="empty-state page-shell">
        <CreditCard size={42} />
        <h1>Siparişi tamamlamak için giriş yapmalısın.</h1>
        <Link className="primary-button" href="/login">
          Giriş yap
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="empty-state page-shell">
        <Check size={42} />
        <h1>Sepetinde ürün bulunmuyor.</h1>
        <button className="primary-button" onClick={() => router.push("/shop")}>
          Mağazaya dön
        </button>
      </main>
    );
  }

  return (
    <main className="checkout-page page-shell">
      <div className="page-title">
        <span className="eyebrow">GÜVENLİ ÖDEME</span>
        <h1>Siparişini tamamla</h1>
      </div>
      <div className="checkout-steps">
        <div className={step === 1 ? "active" : "complete"}>
          <span>{step === 2 ? <Check size={15} /> : "1"}</span>
          <div>
            <strong>Teslimat</strong>
            <small>Adres bilgileri</small>
          </div>
        </div>
        <i />
        <div className={step === 2 ? "active" : ""}>
          <span>2</span>
          <div>
            <strong>Ödeme</strong>
            <small>Kart bilgileri</small>
          </div>
        </div>
      </div>

      <div className="checkout-layout">
        <section className="checkout-form-card">
          {step === 1 ? (
            <form onSubmit={saveAddress}>
              <div className="form-title">
                <MapPin size={22} />
                <div>
                  <h2>Teslimat adresi</h2>
                  <p>Siparişini nereye göndereceğimizi yaz.</p>
                </div>
              </div>
              <div className="form-grid">
                <label>
                  Ad soyad
                  <input name="name" required defaultValue={user?.name ?? ""} />
                </label>
                <label>
                  Telefon
                  <input name="phone" required placeholder="05xx xxx xx xx" />
                </label>
                <label className="full">
                  Adres
                  <textarea name="address" required placeholder="Mahalle, cadde, sokak ve bina no" />
                </label>
                <label>
                  İl
                  <input name="city" required placeholder="İstanbul" />
                </label>
                <label>
                  İlçe
                  <input name="district" required placeholder="Kadıköy" />
                </label>
              </div>
              <button className="primary-button" type="submit">
                Ödemeye geç
              </button>
            </form>
          ) : (
            <form onSubmit={completeOrder}>
              <div className="form-title">
                <CreditCard size={22} />
                <div>
                  <h2>Ödeme bilgileri</h2>
                  <p>Kart bilgilerin yalnızca bu işlem için kullanılır.</p>
                </div>
              </div>
              <div className="card-preview">
                <span>MIRA</span>
                <strong>•••• •••• •••• 4242</strong>
                <small>GÜVENLİ ÖDEME</small>
              </div>
              <div className="form-grid">
                <label className="full">
                  Kart üzerindeki isim
                  <input required placeholder="AD SOYAD" />
                </label>
                <label className="full">
                  Kart numarası
                  <input required inputMode="numeric" placeholder="0000 0000 0000 0000" />
                </label>
                <label>
                  Son kullanma
                  <input required placeholder="AA / YY" />
                </label>
                <label>
                  CVC
                  <input required inputMode="numeric" placeholder="•••" />
                </label>
              </div>
              <div className="form-actions">
                <button className="secondary-button" type="button" onClick={() => setStep(1)}>
                  Geri
                </button>
                <button className="primary-button" type="submit" disabled={submitting}>
                  {submitting ? "Sipariş oluşturuluyor..." : `${money(total)} öde`}
                </button>
              </div>
              {error && <p className="form-message error">{error}</p>}
            </form>
          )}
        </section>
        <aside className="order-summary checkout-summary">
          <h2>Siparişin</h2>
          {items.map((item) => (
            <div className="checkout-item" key={getCartItemKey(item)}>
              <img
                src={
                  item.selectedColor
                    ? item.product.colorImages?.[item.selectedColor] ?? item.product.image
                    : item.product.image
                }
                alt=""
              />
              <span>
                <strong>{item.product.name}</strong>
                {item.quantity} adet{item.selectedSize ? ` · Beden: ${item.selectedSize}` : ""}
                {item.selectedColor ? ` · Renk: ${getColorLabel(item.selectedColor)}` : ""}
              </span>
              <strong>{money(item.product.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Toplam</span>
            <strong>{money(total)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
