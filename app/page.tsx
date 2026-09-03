import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, RefreshCcw } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../lib/products";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">YENİ SEZON / 2026</span>
          <h1>Günlük stil, yeniden düşünüldü.</h1>
          <p>
            İyi hissettiren dokular, sade çizgiler ve uzun süre seninle kalacak
            parçalar.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/shop">
              Koleksiyonu keşfet <ArrowRight size={17} />
            </Link>
            <Link className="text-link" href="/about">
              Hikâyemiz
            </Link>
          </div>
          <div className="hero-stat">
            <strong>4.9/5</strong>
            <span>2.400+ mutlu müşteri</span>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90"
            alt="MIRA yeni sezon koleksiyonu"
          />
          <div className="hero-card">
            <span>Haftanın seçimi</span>
            <strong>Kum Beji Trençkot</strong>
            <Link href="/product/1">İncele</Link>
          </div>
        </div>
      </section>

      <section className="benefits page-shell">
        <div>
          <PackageCheck />
          <span>
            <strong>Ücretsiz teslimat</strong>
            1.500 TL üzeri
          </span>
        </div>
        <div>
          <RefreshCcw />
          <span>
            <strong>Kolay iade</strong>
            30 gün içinde
          </span>
        </div>
        <div>
          <BadgeCheck />
          <span>
            <strong>Güvenli ödeme</strong>
            Korunan alışveriş
          </span>
        </div>
      </section>

      <section className="section page-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">KATEGORİLER</span>
            <h2>Tarzına göre keşfet</h2>
          </div>
          <Link href="/shop">
            Tümünü gör <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              href={`/shop?category=${category.id}`}
              className="category-card"
              key={category.id}
            >
              <img src={category.image} alt={category.label} />
              <span>
                <strong>{category.label}</strong>
                {category.count} ürün
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section page-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ÇOK SEVİLENLER</span>
            <h2>Bu haftanın favorileri</h2>
          </div>
          <Link href="/shop">
            Mağazaya git <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </section>

      <section className="editorial page-shell">
        <div className="editorial-image">
          <img
            src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85"
            alt="Doğal tonlarda MIRA koleksiyonu"
          />
        </div>
        <div className="editorial-copy">
          <span className="eyebrow">MIRA JOURNAL / 01</span>
          <h2>Daha az parça, daha çok kombin.</h2>
          <p>
            Birbiriyle kolayca eşleşen renkler ve formlar seçtik. Sabah
            düşünmeden giyin, gün boyu kendin gibi hisset.
          </p>
          <Link className="primary-button" href="/shop">
            Seçkiyi incele <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="newsletter-block page-shell">
        <span className="eyebrow">MIRA CLUB</span>
        <h2>İyi şeylerden ilk senin haberin olsun.</h2>
        <p>Yeni koleksiyonlar, stil notları ve yalnızca üyelere özel fırsatlar.</p>
        <form>
          <input aria-label="E-posta adresi" type="email" placeholder="E-posta adresin" />
          <button type="submit">Aramıza katıl</button>
        </form>
      </section>
    </main>
  );
}
