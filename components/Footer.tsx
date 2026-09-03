import Link from "next/link";
import { AtSign, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link href="/" className="brand">
            MIRA
          </Link>
          <p>Günlük hayat için sade, güçlü ve uzun ömürlü parçalar.</p>
        </div>
        <div>
          <h3>Keşfet</h3>
          <Link href="/shop">Yeni Gelenler</Link>
          <Link href="/shop?category=women">Kadın</Link>
          <Link href="/shop?category=men">Erkek</Link>
        </div>
        <div>
          <h3>Yardım</h3>
          <Link href="/contact">İletişim</Link>
          <Link href="/cart">Sepet</Link>
          <Link href="/account">Siparişlerim</Link>
        </div>
        <div>
          <h3>Bize katıl</h3>
          <p>Yeni koleksiyonları ve özel fırsatları ilk sen öğren.</p>
          <form className="newsletter">
            <input aria-label="E-posta adresi" type="email" placeholder="E-posta adresin" />
            <button type="submit">Katıl</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MIRA. Tüm hakları saklıdır.</span>
        <div className="socials" aria-label="Sosyal medya">
          <AtSign size={18} />
          <MessageCircle size={18} />
          <Share2 size={18} />
        </div>
      </div>
    </footer>
  );
}
