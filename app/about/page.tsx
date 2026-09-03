import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main>
      <section className="story-hero">
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85"
          alt="MIRA stüdyosu"
        />
        <div>
          <span className="eyebrow">BİZ KİMİZ?</span>
          <h1>Dolabındaki sessiz favorileri tasarlıyoruz.</h1>
        </div>
      </section>
      <section className="story-grid page-shell">
        <div>
          <span className="eyebrow">HİKÂYEMİZ</span>
          <h2>Daha bilinçli bir günlük stil.</h2>
        </div>
        <div>
          <p>
            MIRA, hızlı trendlere yetişmek yerine uzun süre kullanılacak iyi
            parçalar tasarlama fikriyle doğdu. Her koleksiyonda birbirine uyum
            sağlayan renkler, net kalıplar ve rahat dokular kullanıyoruz.
          </p>
          <p>
            Amacımız daha fazla giysi değil; daha kolay giyinmek, daha iyi
            hissetmek ve seçtiklerimizi gerçekten kullanmak.
          </p>
          <Link href="/team">
            Ekibimizle tanış <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="values page-shell">
        {[
          ["01", "Sade", "Gereksiz detaylardan arınmış, kullanışlı tasarımlar."],
          ["02", "Dürüst", "Açık fiyatlar ve anlaşılır ürün bilgileri."],
          ["03", "Uzun ömürlü", "Tek sezona değil, yıllara eşlik eden parçalar."],
        ].map(([no, title, copy]) => (
          <article key={no}>
            <span>{no}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

