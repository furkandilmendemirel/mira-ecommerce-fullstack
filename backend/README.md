# MIRA Backend

MIRA e-commerce uygulamasının öğretici, katmanlı Spring Boot REST API'si.

## Mimari

İstek akışı şu şekildedir:

`Controller -> Service -> Repository -> PostgreSQL`

- **Entity:** PostgreSQL tablolarını ve aralarındaki ilişkiyi temsil eder.
- **Repository:** Spring Data JPA üzerinden veritabanı işlemlerini yapar.
- **Service:** iş kurallarını ve transaction sınırlarını barındırır.
- **Controller:** HTTP isteklerini alır ve uygun HTTP yanıtını üretir.
- **Request/Response DTO:** API sözleşmesini entity modelinden ayırır.
- **GlobalExceptionHandler:** hata cevaplarını tek formatta döndürür.
- **CatalogDataSeeder:** veritabanında ürün yoksa 3 kategori ve 12 örnek ürünü tek seferde ekler.
- **AuthService:** kullanıcı kaydı, giriş, güvenli şifre kontrolü ve JWT üretimini yönetir.
- **CartService:** giriş yapan kullanıcının sepetini ve stok sınırını yönetir.
- **OrderService:** toplamı sunucuda hesaplar; sipariş, stok ve sepet işlemlerini tek transaction içinde yürütür.

`Product`, zorunlu bir `Category` kaydına `ManyToOne` ilişkisiyle bağlıdır. Ürün görselleri ayrı `product_images` tablosunda tutulur. İçinde ürün bulunan kategori yanlışlıkla silinemez.

Kullanıcı şifreleri açık metin olarak tutulmaz; PBKDF2-HMAC-SHA256 ile rastgele salt kullanılarak hash'lenir. Kayıt ve giriş işlemleri istemciye 24 saat geçerli, HMAC-SHA256 imzalı JWT döndürür.

Sepet `cart_items`, sipariş başlığı `customer_orders`, sipariş ürünleri
`order_items` tablolarında tutulur. Sipariş kalemleri ürünün o andaki adını,
görselini ve fiyatını da saklar; ürün daha sonra güncellense bile eski sipariş
bozulmaz. Kart numarası ve CVC backend'e gönderilmez veya saklanmaz.

## Gereksinimler

- Java 21
- IntelliJ IDEA
- PostgreSQL 16 (bilgisayarda kurduğumuz `mira` veritabanı)

## Çalıştırma

1. PostgreSQL'in çalıştığından emin olun.
2. IntelliJ'de `MiraApiApplication.java` dosyasını açın.
3. Üstteki yeşil çalıştırma düğmesine basın.
4. Konsolda `Started MiraApiApplication` yazısını bekleyin.

API `http://localhost:8080` adresinde açılır. İlk başarılı açılışta ürün tablosu boşsa örnek katalog otomatik yüklenir; ürünleri tek tek eklemek gerekmez. React geliştirme sunucusu `http://localhost:3000` adresinden bu API'ye bağlanabilir.

Testleri çalıştırmak için PostgreSQL gerekmez:

```bash
mvn test
```

## Endpointler

| Metot | Adres | İşlem |
|---|---|---|
| GET | `/api/categories` | Tüm kategoriler |
| GET | `/api/categories/{id}` | Tek kategori |
| POST | `/api/categories` | Kategori oluştur |
| PUT | `/api/categories/{id}` | Kategori güncelle |
| DELETE | `/api/categories/{id}` | Kategori sil |
| GET | `/api/products` | Filtrelenmiş ve sayfalanmış ürünler |
| GET | `/api/products/{id}` | Tek ürün |
| POST | `/api/products` | Ürün oluştur |
| PUT | `/api/products/{id}` | Ürün güncelle |
| DELETE | `/api/products/{id}` | Ürün sil |
| POST | `/api/auth/register` | Kullanıcı kaydı ve JWT üretimi |
| POST | `/api/auth/login` | Kullanıcı girişi ve JWT üretimi |
| GET | `/api/auth/me` | Bearer token ile oturum kullanıcısı |
| GET | `/api/cart` | Oturum kullanıcısının sepeti |
| POST | `/api/cart/items` | Sepete ürün ekle veya adedini belirle |
| PUT | `/api/cart/items/{itemId}` | Belirli sepet satırının adedini değiştir |
| DELETE | `/api/cart/items/{itemId}` | Belirli sepet satırını sil |
| DELETE | `/api/cart` | Sepeti temizle |
| GET | `/api/orders` | Kullanıcının sipariş geçmişi |
| GET | `/api/orders/{id}` | Kullanıcıya ait tek sipariş |
| POST | `/api/orders` | Sepetten sipariş oluştur |

Kullanıcı kaydı örneği:

```json
{
  "name": "Mira Kullanıcı",
  "email": "mira@example.com",
  "password": "Mira1234"
}
```

`/api/auth/me` isteğinde token şu başlıkla gönderilir:

```text
Authorization: Bearer <token>
```

Sepete ürün ekleme örneği:

```json
{
  "productId": 1,
  "quantity": 2,
  "selectedSize": "M",
  "selectedColor": "#000000"
}
```

Aynı ürün farklı beden veya renkle eklendiğinde ayrı bir sepet satırı oluşur.
`PUT` ve `DELETE` işlemlerinde ürün kimliği değil, sepet cevabındaki satır
`id` değeri kullanılır.

Sipariş oluşturma örneği:

```json
{
  "shippingName": "Mira Kullanıcı",
  "shippingPhone": "05550000000",
  "shippingAddress": "MIRA Sokak No: 1",
  "shippingCity": "İstanbul",
  "shippingDistrict": "Kadıköy"
}
```

`POST /api/orders` fiyatı istemciden kabul etmez. Güncel ürün fiyatlarını
PostgreSQL'den okur; yeterli stok yoksa `400`, token yoksa `401` döndürür.
Başarılı işlem siparişi kaydeder, stoğu azaltır ve sepeti temizler.

Katalog otomatik gelir. CRUD öğrenmek veya yeni kayıt denemek için kategori oluşturma örneği:

```json
{
  "name": "Giyim",
  "description": "MIRA giyim ürünleri",
  "code": "kadin-giyim",
  "img": "https://example.com/category.jpg",
  "rating": 4.8,
  "gender": "k"
}
```

Sonra dönen kategori kimliğini kullanarak ürün oluşturun:

```json
{
  "name": "Basic T-Shirt",
  "description": "Pamuklu tişört",
  "price": 599.90,
  "stock": 25,
  "categoryId": 1,
  "storeId": 1,
  "rating": 4.7,
  "sellCount": 120,
  "images": ["https://example.com/product.jpg"]
}
```

Ürün listeleme örnekleri:

```text
GET /api/products?limit=8&offset=0
GET /api/products?category=2&filter=ceket&sort=price:asc&limit=8&offset=0
```

Liste cevabı frontend'in beklediği `{ "products": [...], "total": 12 }` biçimindedir.

Başarılı `POST` istekleri `201 Created`, başarılı silme `204 No Content` döndürür. Geçersiz alanlar `400`, bulunamayan kayıtlar `404`, çakışan kategori adı veya dolu kategori silme işlemi `409` döndürür.

> Öğrenme notu: `spring.jpa.hibernate.ddl-auto=update` ilk geliştirme aşamasında tabloları otomatik kurar. Proje büyüdüğünde bunu Flyway migration dosyalarıyla değiştirmek daha güvenlidir.
