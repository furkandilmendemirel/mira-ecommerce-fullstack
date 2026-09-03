import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("MIRA ana sayfasını sunucu tarafında oluşturur", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>MIRA — Günlük stil, yeniden düşünüldü<\/title>/i);
  assert.match(html, /Günlük stil, yeniden düşünüldü\./);
  assert.match(html, /Koleksiyonu keşfet/);
  assert.match(html, /Bu haftanın favorileri/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("frontend katalog, ürün detayı ve kullanıcı işlemleri Spring Boot backend'ine bağlıdır", async () => {
  const [
    route,
    backendApi,
    adapter,
    detailPage,
    loginPage,
    signupPage,
    authProxy,
    authController,
    controller,
    seeder,
  ] = await Promise.all([
    readFile(new URL("../app/api/products/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/backend-api.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/backend-products.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/product/[id]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/signup/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/auth-proxy.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../backend/src/main/java/com/mira/api/auth/AuthController.java", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../backend/src/main/java/com/mira/api/product/ProductController.java", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../backend/src/main/java/com/mira/api/config/CatalogDataSeeder.java", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(backendApi, /MIRA_API_URL/);
  assert.match(backendApi, /localhost:8080\/api/);
  assert.match(adapter, /toFrontendProduct/);
  assert.match(route, /categoryCode/);
  assert.match(route, /data\.products\.map\(toFrontendProduct\)/);
  assert.match(detailPage, /fetch\(`\$\{backendUrl\}\/products\/\$\{id\}`/);
  assert.match(detailPage, /toFrontendProduct\(backendProduct\)/);
  assert.match(loginPage, /fetch\("\/api\/auth\/login"/);
  assert.match(signupPage, /fetch\("\/api\/auth\/register"/);
  assert.doesNotMatch(signupPage, /localStorage\.setItem\("mira-user"/);
  assert.match(authProxy, /fetch\(`\$\{backendUrl\}\/auth\/\$\{action\}`/);
  assert.match(authController, /@PostMapping\("\/register"\)/);
  assert.match(authController, /@PostMapping\("\/login"\)/);
  assert.match(controller, /@RequestMapping\("\/api\/products"\)/);
  assert.match(controller, /ProductPageResponse/);
  assert.match(seeder, /productRepository\.count\(\) > 0/);
  assert.match(seeder, /Kum Beji Trençkot/);
});

test("sepet ve sipariş akışı kullanıcıya ait PostgreSQL verisini kullanır", async () => {
  const [
    cartProxy,
    orderProxy,
    cartClient,
    checkoutPage,
    accountPage,
    cartController,
    orderController,
    orderService,
    productDetail,
    cartService,
  ] = await Promise.all([
    readFile(new URL("../app/api/cart/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/orders/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/cart-client.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/checkout/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/account/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../backend/src/main/java/com/mira/api/cart/CartController.java", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../backend/src/main/java/com/mira/api/order/OrderController.java", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../backend/src/main/java/com/mira/api/order/OrderService.java", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../components/ProductDetailClient.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../backend/src/main/java/com/mira/api/cart/CartService.java", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(cartProxy, /forwardBackendRequest\(request, "\/cart"\)/);
  assert.match(orderProxy, /forwardBackendRequest\(request, "\/orders"\)/);
  assert.match(cartClient, /Authorization: `Bearer \$\{token\}`/);
  assert.match(cartClient, /mergeCartAfterLogin/);
  assert.match(checkoutPage, /fetch\("\/api\/orders"/);
  assert.doesNotMatch(checkoutPage, /localStorage\.setItem\("mira-orders"/);
  assert.match(accountPage, /fetch\("\/api\/orders"/);
  assert.doesNotMatch(accountPage, /localStorage\.getItem\("mira-orders"/);
  assert.match(cartController, /@RequestMapping\("\/api\/cart"\)/);
  assert.match(cartController, /@PostMapping\("\/items"\)/);
  assert.match(orderController, /@RequestMapping\("\/api\/orders"\)/);
  assert.match(orderController, /@PostMapping/);
  assert.match(orderService, /cartItemRepository\.deleteAllByUserId/);
  assert.match(orderService, /setStock\(cartItem\.getProduct\(\)\.getStock\(\) - cartItem\.getQuantity\(\)\)/);
  assert.match(productDetail, /disabled=\{selectionMissing\}/);
  assert.match(productDetail, /getProductSizes\(product\)/);
  assert.match(productDetail, /setSelectedColor\(color\)/);
  assert.match(productDetail, /aria-pressed=\{selectedColor === color\}/);
  assert.match(productDetail, /product\.colorImages\?\.\[selectedColor\]/);
  assert.match(cartClient, /selectedSize/);
  assert.match(cartClient, /selectedColor/);
  assert.match(cartService, /validateAndNormalizeSize/);
  assert.match(cartService, /validateAndNormalizeColor/);
});
