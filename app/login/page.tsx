"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
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

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email")).trim();
    const password = String(data.get("password"));

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as AuthResult;

      if (!response.ok || !result.token || !result.user) {
        const validationMessage = result.validationErrors
          ? Object.values(result.validationErrors)[0]
          : undefined;
        setError(validationMessage ?? result.message ?? "Giriş yapılamadı.");
        setSubmitting(false);
        return;
      }

      dispatch(login({ user: result.user, token: result.token }));
      const mergedCart = await mergeCartAfterLogin(result.token, cartItems);
      dispatch(hydrateCart(mergedCart));
      router.push("/account");
    } catch {
      setError("Backend bağlantısı kurulamadı. Spring Boot açık mı kontrol et.");
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-visual">
        <img
          src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=1200&q=85"
          alt="MIRA koleksiyonu"
        />
        <div>
          <span className="eyebrow">MIRA CLUB</span>
          <h2>Tarzın kaldığın yerden devam etsin.</h2>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">HOŞ GELDİN</span>
          <h1>Hesabına giriş yap</h1>
          <p>Siparişlerini ve sepetini tek yerden takip et.</p>
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
              <input name="password" type="password" required placeholder="••••••••" />
            </span>
          </label>
          {error && <p className="form-message error">{error}</p>}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Giriş yapılıyor..." : "Giriş yap"} <ArrowRight size={17} />
          </button>
          <small>
            Hesabın yok mu? <Link href="/signup">Ücretsiz kayıt ol</Link>
          </small>
        </form>
      </div>
    </main>
  );
}
