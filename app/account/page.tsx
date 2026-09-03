"use client";

import Link from "next/link";
import { CheckCircle2, Package, UserRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  type AccountOrder,
  type BackendOrder,
  toAccountOrder,
} from "../../lib/customer-data";
import { useAppSelector } from "../../store/hooks";
import { getColorLabel } from "../../lib/products";

export default function AccountPage() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const params = useSearchParams();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!token) return;
    let active = true;
    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (response) => {
        const data = (await response.json()) as BackendOrder[] & { message?: string };
        if (!response.ok) throw new Error(data.message ?? "Siparişler alınamadı");
        if (active) setOrders(data.map(toAccountOrder));
      })
      .catch((error: Error) => {
        if (active) setOrdersError(error.message);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  if (!hydrated) return <main className="account-page page-shell" />;

  if (!user) {
    return (
      <main className="empty-state page-shell">
        <UserRound size={42} />
        <h1>Hesabına giriş yap</h1>
        <p>Siparişlerini görmek ve sepetini korumak için giriş yapmalısın.</p>
        <Link className="primary-button" href="/login">
          Giriş yap
        </Link>
      </main>
    );
  }

  return (
    <main className="account-page page-shell">
      {params.get("order") === "success" && (
        <div className="success-banner">
          <CheckCircle2 />
          <span>
            <strong>Siparişin alındı!</strong>
            Hazırlanmaya başladığında sana haber vereceğiz.
          </span>
        </div>
      )}
      <div className="account-heading">
        <span className="eyebrow">HESABIM</span>
        <h1>Merhaba, {user.name.split(" ")[0]}.</h1>
        <p>{user.email}</p>
      </div>
      <section className="orders">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GEÇMİŞ SİPARİŞLER</span>
            <h2>Siparişlerin</h2>
          </div>
        </div>
        {ordersLoading ? (
          <div className="no-orders"><p>Siparişlerin yükleniyor...</p></div>
        ) : ordersError ? (
          <p className="form-message error">{ordersError}</p>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <Package size={34} />
            <p>Henüz bir siparişin yok.</p>
            <Link href="/shop">Alışverişe başla</Link>
          </div>
        ) : (
          orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-head">
                <span>
                  <small>Sipariş no</small>
                  <strong>{order.id}</strong>
                </span>
                <span>
                  <small>Tarih</small>
                  <strong>{order.date}</strong>
                </span>
                <span>
                  <small>Toplam</small>
                  <strong>{order.total.toLocaleString("tr-TR")} TL</strong>
                </span>
                <b>{order.status}</b>
              </div>
              <div className="order-products">
                {order.items.map((item) => (
                  <div key={item.product.id}>
                    <img src={item.product.image} alt={item.product.name} />
                    <span>
                      {item.quantity}
                      {item.selectedSize ? ` · ${item.selectedSize}` : ""}
                      {item.selectedColor ? ` · ${getColorLabel(item.selectedColor)}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
