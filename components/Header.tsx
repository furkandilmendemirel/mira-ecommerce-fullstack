"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { logout } from "../store/authSlice";
import { clearCart } from "../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <>
      <div className="announcement">
        <span>Ücretsiz kargo: 1.500 TL ve üzeri siparişlerde</span>
        <span className="announcement-secondary">
          Yaz seçkisinde %30&apos;a varan indirim
        </span>
      </div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Mira ana sayfa">
          MIRA
        </Link>
        <button
          className="menu-button"
          type="button"
          aria-label="Menüyü aç"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={22} />
        </button>
        <nav className={open ? "main-nav is-open" : "main-nav"}>
          <Link href="/" onClick={() => setOpen(false)}>
            Ana Sayfa
          </Link>
          <Link href="/shop" onClick={() => setOpen(false)}>
            Mağaza
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            Hakkımızda
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            İletişim
          </Link>
        </nav>
        <div className="header-actions">
          <Link href="/shop" aria-label="Ürün ara">
            <Search size={19} />
          </Link>
          <Link href={user ? "/account" : "/login"} aria-label="Hesabım">
            <UserRound size={19} />
          </Link>
          <button className="icon-button" aria-label="Favoriler" type="button">
            <Heart size={19} />
          </button>
          <Link className="cart-link" href="/cart" aria-label="Sepet">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
          {user && (
            <button
              className="text-button header-logout"
              type="button"
              onClick={() => {
                dispatch(logout());
                dispatch(clearCart());
              }}
            >
              Çıkış
            </button>
          )}
        </div>
      </header>
    </>
  );
}
