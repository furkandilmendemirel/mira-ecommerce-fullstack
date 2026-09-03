"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { mergeCartAfterLogin } from "../../lib/cart-client";
import { login } from "../../store/authSlice";
import type { User } from "../../store/authSlice";
import { hydrateCart } from "../../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

type AuthResult = {
  token?: string;
  user?: User;
  message?: string;
  validationErrors?: Record<string, string>;
};

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();
    const password = String(data.get("password"));

    if (password.length < 8) {
      setMessage("Şifren en az 8 karakter olmalı.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = (await response.json()) as AuthResult;

      if (!response.ok || !result.token || !result.user) {
        const validationMessage = result.validationErrors
          ? Object.values(result.validationErrors)[0]
          : undefined;
        setMessage(validationMessage ?? result.message ?? "Hesap oluşturulamadı.");
        setSubmitting(false);
        return;
      }

      dispatch(login({ user: result.user, token: result.token }));
      const mergedCart = await mergeCartAfterLogin(result.token, cartItems);
      dispatch(hydrateCart(mergedCart));
      router.push("/account");
    } catch {
      setMessage("Backend bağlantısı kurulamadı. Spring Boot açık mı kontrol et.");
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-visual auth-visual-signup">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
          alt="MIRA günlük stil"
        />
        <div>
          <span className="eyebrow">YENİ BAŞLANGIÇ</span>
          <h2>Favorilerin, siparişlerin ve sana özel seçkiler.</h2>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">MIRA&apos;YA KATIL</span>
          <h1>Hesabını oluştur</h1>
          <p>Bir dakikadan kısa sürer.</p>
          <label>
            Ad soyad
            <span className="input-with-icon">
              <UserRound size={17} />
              <input name="name" required placeholder="Adın Soyadın" />
            </span>
          </label>
          <label>
            E-posta
            <span className="input-with-icon">
              <Mail size={17} />
              <input name="email" type="email" required placeholder="sen@ornek.com" />
            </span>
          </label>
          <label>
            Şifre
            <span className="input-with-icon">
              <LockKeyhole size={17} />
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="En az 8 karakter"
              />
            </span>
          </label>
          {message && <p className="form-message error">{message}</p>}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Hesap oluşturuluyor..." : "Hesap oluştur"} <ArrowRight size={17} />
          </button>
          <small>
            Zaten hesabın var mı? <Link href="/login">Giriş yap</Link>
          </small>
        </form>
      </div>
    </main>
  );
}
