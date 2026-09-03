# MIRA E-Commerce

MIRA, öğretici bir full-stack e-ticaret projesidir. Kullanıcı arayüzü React/Next,
REST API Spring Boot, veritabanı PostgreSQL ile geliştirilmiştir.

## Mimari

```text
React frontend
      ↓ HTTP / JSON
Spring Boot REST API
      ↓ JPA / Hibernate
PostgreSQL
```

Frontend mağaza ve kullanıcı isteklerini kendi `/api` route'larına gönderir. Bu
route'lar istekleri `http://localhost:8080/api` adresindeki Spring Boot API'ye
iletir. Ürün cevapları React kartlarının kullandığı biçime dönüştürülür; kayıt ve
giriş cevaplarında backend'in ürettiği JWT kullanılır. Giriş yapan kullanıcının
sepeti ve siparişleri de PostgreSQL'de tutulur; sayfa yenilendiğinde kaybolmaz.

## Klasörler

- `app/`, `components/`, `store/`: React/Next frontend
- `app/api/`: frontend ile Spring Boot arasındaki ürün ve kullanıcı adaptörleri
- `backend/`: Spring Boot backend
- `backend/src/main/java/com/mira/api/auth`: kayıt, giriş ve JWT işlemleri
- `backend/src/main/java/com/mira/api/user`: kullanıcı entity ve repository
- `backend/src/main/java/com/mira/api/category`: Category katmanları
- `backend/src/main/java/com/mira/api/product`: Product katmanları
- `backend/src/main/java/com/mira/api/cart`: kullanıcıya ait kalıcı sepet
- `backend/src/main/java/com/mira/api/order`: sipariş ve sipariş kalemleri
- `backend/src/main/java/com/mira/api/common`: ortak hata yönetimi
- `backend/src/main/java/com/mira/api/config`: CORS ve otomatik katalog verisi

## İlk çalıştırma

1. PostgreSQL'i açın. `mira` veritabanı ve giriş yapabilen `mira` kullanıcısı
   bulunmalıdır. Varsayılan parola `mira_password` değeridir.
2. IntelliJ'de `backend` klasörünü açın.
3. `MiraApiApplication.java` dosyasındaki yeşil çalıştırma düğmesine basın.
4. Konsolda `Started MiraApiApplication` yazısını bekleyin.
5. Frontend ana klasöründe aşağıdaki komutları çalıştırın:

```bash
npm install
npm run dev
```

Frontend terminalde gösterilen yerel adreste açılır. Backend
`http://localhost:8080` adresinde çalışır.

Veritabanında ürün yoksa backend ilk açılışta 3 kategori ve 12 örnek ürünü
otomatik ekler. Ürünleri tek tek yazmak gerekmez; sonraki açılışlarda mevcut
kayıtlar korunur.

Tarayıcıda `http://localhost:3000/signup` adresinden yeni kullanıcı oluşturulur.
Kullanıcı PostgreSQL'deki `users` tablosuna kaydedilir. Şifre açık şekilde değil,
salt eklenmiş PBKDF2 hash olarak saklanır. Kayıt tamamlandığında frontend gerçek
JWT ile kullanıcıyı hesabına yönlendirir.

Giriş yapıldıktan sonra sepete eklenen ürünler `cart_items` tablosunda saklanır.
Ödeme ekranı kart numarasını veritabanına yazmaz; yalnızca teslimat bilgilerini
backend'e yollar. Backend fiyatı yeniden hesaplar, siparişi ve ürün anlık
bilgilerini kaydeder, stoğu azaltır ve sepeti temizler.

## Backend katmanları

```text
Controller -> Service -> Repository -> PostgreSQL
```

- Entity: veritabanı tablolarını temsil eder.
- Repository: JPA ile veritabanı sorgularını çalıştırır.
- Service: iş kurallarını ve DTO dönüşümlerini yönetir.
- Controller: REST endpointlerini açar.
- Request/Response DTO: dışarıdan gelen ve dışarı dönen veriyi sınırlar.
- GlobalExceptionHandler: 400, 401, 404 ve 409 hata cevaplarını standartlaştırır.

## Katalog endpointleri

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

## Kullanıcı endpointleri

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (`Authorization: Bearer <token>`)

## Sepet ve sipariş endpointleri

Bu isteklerin tamamında `Authorization: Bearer <token>` başlığı zorunludur.

- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{itemId}`
- `DELETE /api/cart/items/{itemId}`
- `DELETE /api/cart`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders`

Sepet aynı ürünün farklı renk veya bedenlerini ayrı satırlar halinde tutar.
Adet değiştirme ve silme işlemleri, `GET /api/cart` cevabındaki sepet satırı
`id` değeri üzerinden yapılır.

Sipariş oluşturulunca tek transaction içinde şu işlemler yapılır:

```text
Sepeti oku -> stoğu doğrula -> toplamı hesapla -> siparişi kaydet
            -> stoğu azalt -> sepeti temizle
```

PostgreSQL'de oluşan tablolar:

```text
categories, products, product_images, users,
cart_items, customer_orders, order_items
```

Örnek kayıt isteği:

```json
{
  "name": "Mira Kullanıcı",
  "email": "mira@example.com",
  "password": "Mira1234"
}
```

Ürün listesi; kategori, arama, sıralama ve sayfalama parametrelerini destekler:

```text
/api/products?categoryCode=women&filter=ceket&sort=price:asc&limit=8&offset=0
```

## Kontroller

Frontend üretim derlemesi:

```bash
npm run build
```

Backend testleri IntelliJ'nin Maven panelinden `test` görevi çalıştırılarak
başlatılabilir. Backend entegrasyon testleri H2 kullandığı için PostgreSQL'e
ihtiyaç duymaz.

Başka bir backend adresi kullanılacaksa frontend şu ortam değişkeniyle
başlatılabilir:

```text
MIRA_API_URL=https://backend-adresi.example.com/api
```

## Hocaya sunum sırası

1. IntelliJ konsolunda `Started MiraApiApplication` satırını gösterin.
2. `Category` veya `Product` paketinde Entity → Repository → Service → Controller
   akışını anlatın.
3. Mağaza ekranını açıp ürünlerin PostgreSQL'den geldiğini gösterin.
4. Bir ürünün fiyatını `PUT /api/products/{id}` ile değiştirip sayfayı yenileyin.
5. Kayıt ekranından yeni hesap oluşturun ve pgAdmin'de `users` tablosundaki yeni
   kaydı gösterin. Şifrenin açık metin olmadığını özellikle belirtin.
6. Yanlış şifreyle giriş deneyerek backend'in `401 Unauthorized` cevabını
   gösterin.
7. Bir ürünü sepete ekleyin, sayfayı yenileyip sepetin korunduğunu gösterin.
8. Ödeme ekranından bir sipariş oluşturun. Hesap sayfasında sipariş numarasını
   ve ürünleri gösterin.
9. pgAdmin'de `cart_items`, `customer_orders` ve `order_items` tablolarını
   yenileyin. Sepetin boşaldığını, siparişin kaldığını ve ürün stoğunun
   azaldığını anlatın.

## Şu an projenin durumu

Tamamlanan ana full-stack akışlar:

- PostgreSQL'den kategori ve ürün listeleme
- ürün arama, filtreleme, sıralama ve detay sayfası
- kullanıcı kaydı, güvenli şifre hash'i, giriş ve JWT
- kullanıcıya ait kalıcı sepet
- teslimat bilgisiyle sipariş oluşturma
- stok azaltma ve geçmiş siparişleri hesap ekranında gösterme

Gerçek banka/ödeme kuruluşu entegrasyonu yoktur. Kart alanları sunum amaçlıdır ve
backend'e gönderilmez. Admin paneli, favoriler ve canlı ödeme sonraki geliştirme
aşamalarıdır.
