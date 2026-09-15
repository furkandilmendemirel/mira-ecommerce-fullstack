# MIRA E-Commerce

MIRA, modern bir full-stack e-ticaret uygulamasıdır. Proje; ürün listeleme,
kullanıcı yönetimi, kalıcı sepet, sipariş oluşturma ve stok yönetimi gibi
temel e-ticaret işlevlerini uçtan uca gerçekleştirmektedir.

## Live Demo

**Frontend:**  
https://mira-ecommerce-fullst.vercel.app

**Backend API:**  
https://mira-ecommerce-fullstack.onrender.com/api

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Redux Toolkit

### Backend
- Java
- Spring Boot
- Spring Data JPA / Hibernate
- JWT Authentication

### Database
- PostgreSQL
- Neon

### Deployment
- Vercel — Frontend
- Render — Spring Boot REST API
- Neon — PostgreSQL Database

## Architecture

```text
User
  ↓
Next.js / React
(Vercel)
  ↓
Next.js API Routes
  ↓ HTTP / JSON
Spring Boot REST API
(Render)
  ↓ JPA / Hibernate
PostgreSQL
(Neon)
```

Frontend, backend ile Next.js API route'ları üzerinden iletişim kurar.
Bu route'lar gerekli istekleri Spring Boot REST API'ye iletir.

Production ortamında backend adresi `MIRA_API_URL` environment variable
üzerinden belirlenmektedir.

Kullanıcı giriş yaptığında backend tarafından JWT oluşturulur. Kullanıcının
sepeti ve siparişleri PostgreSQL veritabanında saklandığı için sayfa
yenilendiğinde veya kullanıcı tekrar giriş yaptığında veriler korunur.

## Project Structure

- `app/`: Next.js App Router sayfaları ve API route'ları
- `components/`: tekrar kullanılabilir React bileşenleri
- `store/`: Redux Toolkit state yönetimi
- `public/`: ürün görselleri ve statik dosyalar
- `backend/`: Spring Boot REST API
- `backend/src/main/java/com/mira/api/auth`: kayıt, giriş ve JWT işlemleri
- `backend/src/main/java/com/mira/api/user`: kullanıcı işlemleri
- `backend/src/main/java/com/mira/api/category`: kategori işlemleri
- `backend/src/main/java/com/mira/api/product`: ürün ve stok işlemleri
- `backend/src/main/java/com/mira/api/cart`: kullanıcıya ait kalıcı sepet
- `backend/src/main/java/com/mira/api/order`: sipariş ve sipariş kalemleri
- `backend/src/main/java/com/mira/api/common`: ortak hata yönetimi
- `backend/src/main/java/com/mira/api/config`: uygulama yapılandırmaları

## Local Development

### Frontend

Projenin ana klasöründe:

```bash
npm install
npm run dev
```

Frontend varsayılan olarak:

```text
http://localhost:3000
```

adresinde çalışır.

### Backend

`backend` klasörü IntelliJ IDEA veya başka bir Java IDE ile açılır ve
`MiraApiApplication.java` çalıştırılır.

Backend varsayılan olarak:

```text
http://localhost:8080
```

adresinde çalışır.

Frontend'in kullanacağı backend adresi environment variable ile belirlenebilir:

```text
MIRA_API_URL=http://localhost:8080/api
```

Production ortamında bu değişken Render üzerinde çalışan Spring Boot API
adresini göstermektedir.

Veritabanı bağlantı bilgileri environment variable'lar üzerinden backend'e
sağlanmalıdır. Gerçek kullanıcı adı, parola veya production bağlantı bilgileri
repository içerisinde tutulmamalıdır.

## Authentication

MIRA, JWT tabanlı kullanıcı kayıt ve giriş sistemine sahiptir.

Kullanıcı kayıt olduğunda kullanıcı bilgileri PostgreSQL veritabanındaki
`users` tablosunda saklanır.

Parolalar açık metin olarak saklanmaz; hash'lenerek veritabanına kaydedilir.

Başarılı giriş sonrasında backend bir JWT üretir. Kimlik doğrulaması gerektiren
sepet ve sipariş işlemlerinde bu token kullanılır.

```text
Authorization: Bearer <token>
```

## Product Catalog

Ürünler PostgreSQL veritabanından Spring Boot REST API aracılığıyla alınır.

Ürün sistemi:

- kategoriye göre filtreleme
- ürün arama
- fiyat veya puana göre sıralama
- sayfalama
- ürün detaylarını görüntüleme
- renk ve beden seçenekleri

özelliklerini desteklemektedir.

Örnek ürün sorgusu:

```text
/api/products?categoryCode=women&filter=ceket&sort=price:asc&limit=8&offset=0
```

## Shopping Cart

Giriş yapan kullanıcıların sepetleri PostgreSQL üzerinde kalıcı olarak tutulur.

Desteklenen işlemler:

- sepete ürün ekleme
- ürün adedini değiştirme
- sepetten ürün silme
- sepeti tamamen temizleme
- sayfa yenilendiğinde sepeti tekrar yükleme

Sepette aynı ürünün farklı renk veya beden seçenekleri ayrı satırlar halinde
saklanabilir.

## Checkout & Orders

Kullanıcı checkout işlemini tamamladığında sipariş Spring Boot backend
tarafından işlenir.

```text
Sepeti oku
    ↓
Stok kontrolü
    ↓
Fiyatları backend üzerinde yeniden hesapla
    ↓
Siparişi oluştur
    ↓
Sipariş ürünlerini kaydet
    ↓
Ürün stoklarını azalt
    ↓
Sepeti temizle
```

Sipariş oluşturulurken ürün fiyatları backend tarafından tekrar hesaplanır ve
stok durumu kontrol edilir.

Başarılı sipariş sonrasında:

- sipariş PostgreSQL'e kaydedilir
- sipariş ürünleri ayrı olarak saklanır
- ürün stokları azaltılır
- kullanıcının sepeti temizlenir
- sipariş kullanıcının hesabına bağlanır
- kullanıcı geçmiş siparişlerini görüntüleyebilir

## REST API

### Categories

```text
GET    /api/categories
POST   /api/categories
GET    /api/categories/{id}
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

### Products

```text
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Cart

```text
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/{itemId}
DELETE /api/cart/items/{itemId}
DELETE /api/cart
```

### Orders

```text
GET  /api/orders
GET  /api/orders/{id}
POST /api/orders
```

Sepet ve sipariş endpointleri kullanıcı authentication'ı gerektirir.

## Database

Production veritabanı PostgreSQL kullanmaktadır ve Neon üzerinde
barındırılmaktadır.

Uygulamanın temel tabloları:

```text
users
categories
products
product_images
product_colors
product_color_images
product_sizes
cart_items
customer_orders
order_items
```

Sipariş sistemi ilişkisel olarak tasarlanmıştır:

```text
users
  ↓
customer_orders
  ↓
order_items
  ↓
products
```

`customer_orders` siparişin genel bilgilerini tutarken `order_items`
sipariş içerisindeki ürün bilgilerini saklar.

## Deployment

MIRA production ortamında üç farklı cloud servisi kullanmaktadır.

```text
Next.js Frontend
      ↓
    Vercel

Spring Boot REST API
      ↓
    Render

PostgreSQL Database
      ↓
     Neon
```

Frontend Vercel üzerinde, backend Render üzerinde ve PostgreSQL veritabanı
Neon üzerinde çalışmaktadır.

Bu yapı sayesinde frontend, backend ve veritabanı birbirinden bağımsız olarak
deploy edilebilir ve yönetilebilir.

## Testing & Validation

Frontend production build'i:

```bash
npm run build
```

komutuyla kontrol edilebilir.

Backend testleri Maven üzerinden çalıştırılabilir.

Production ortamında aşağıdaki full-stack akışlar test edilmiştir:

- kullanıcı oluşturma
- kullanıcı girişi
- JWT authentication
- PostgreSQL'den ürün listeleme
- ürün arama ve filtreleme
- sepete ürün ekleme
- sepet miktarını değiştirme
- kalıcı kullanıcı sepeti
- checkout işlemi
- sipariş oluşturma
- sipariş ürünlerinin veritabanına kaydedilmesi
- sipariş sonrası stokların azaltılması
- sipariş sonrası sepetin temizlenmesi
- kullanıcıya ait sipariş geçmişinin görüntülenmesi

## Current Status

MIRA'nın temel full-stack e-ticaret akışı tamamlanmıştır.

```text
Product Catalog
      ↓
User Authentication
      ↓
Shopping Cart
      ↓
Checkout
      ↓
Order Creation
      ↓
Stock Update
      ↓
Order History
```

Frontend, backend ve veritabanı production ortamında birbirleriyle bağlantılı
şekilde çalışmaktadır.

Gerçek banka veya ödeme kuruluşu entegrasyonu bulunmamaktadır. Checkout
ekranındaki ödeme alanları demo amaçlıdır ve kart bilgileri backend'e veya
veritabanına kaydedilmez.

## Future Improvements

Projeye ileride eklenebilecek özellikler:

- admin paneli
- favori ürünler
- gerçek ödeme sistemi entegrasyonu
- sipariş durumu yönetimi
- e-posta ile sipariş bilgilendirmesi
- ürün yorumları
- gelişmiş arama ve filtreleme
- yönetici tarafında stok ve ürün yönetimi