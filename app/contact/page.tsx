import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="contact-page page-shell">
      <section>
        <span className="eyebrow">BİZE ULAŞ</span>
        <h1>Nasıl yardımcı olabiliriz?</h1>
        <p>
          Siparişin, ürünlerimiz veya MIRA hakkında merak ettiğin her şeyi
          yazabilirsin.
        </p>
        <div className="contact-details">
          <div>
            <Mail />
            <span>
              <strong>E-posta</strong>
              hello@mira.com
            </span>
          </div>
          <div>
            <Phone />
            <span>
              <strong>Telefon</strong>
              +90 212 555 20 26
            </span>
          </div>
          <div>
            <MapPin />
            <span>
              <strong>Stüdyo</strong>
              Kadıköy, İstanbul
            </span>
          </div>
        </div>
      </section>
      <form className="contact-form">
        <label>
          Ad soyad
          <input required placeholder="Adın Soyadın" />
        </label>
        <label>
          E-posta
          <input required type="email" placeholder="sen@ornek.com" />
        </label>
        <label>
          Konu
          <select defaultValue="order">
            <option value="order">Sipariş hakkında</option>
            <option value="product">Ürün hakkında</option>
            <option value="other">Diğer</option>
          </select>
        </label>
        <label>
          Mesajın
          <textarea required placeholder="Sana nasıl yardımcı olabiliriz?" />
        </label>
        <button className="primary-button" type="submit">
          Mesajı gönder
        </button>
      </form>
    </main>
  );
}
