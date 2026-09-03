package com.mira.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CartOrderApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void authenticatedCartAndOrderFlowPersists() throws Exception {
        String registration = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Sipariş Kullanıcısı","email":"order@mira.test","password":"Mira1234"}
                                """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String token = objectMapper.readTree(registration).get("token").asText();

        String categoryJson = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Sipariş Test Kategorisi","description":"Test"}
                                """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long categoryId = objectMapper.readTree(categoryJson).get("id").asLong();

        String productJson = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name":"Sipariş Test Ürünü",
                                  "description":"Test ürünü",
                                  "price":1600.00,
                                  "stock":5,
                                  "categoryId":%d,
                                  "images":["https://example.com/order-product.jpg"],
                                  "sizes":["S","M","L"],
                                  "colors":["#000000","#ffffff"],
                                  "colorImages":{
                                    "#000000":"/products/test/siyah.png",
                                    "#ffffff":"/products/test/beyaz.png"
                                  }
                                }
                                """.formatted(categoryId)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long productId = objectMapper.readTree(productJson).get("id").asLong();

        mockMvc.perform(post("/api/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"productId":%d,"quantity":2}
                                """.formatted(productId)))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/cart/items")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"productId":%d,"quantity":2}
                                """.formatted(productId)))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/cart/items")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"productId":%d,"quantity":1,"selectedSize":"M","selectedColor":"#000000"}
                                """.formatted(productId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemCount").value(1))
                .andExpect(jsonPath("$.items[0].id").isNumber())
                .andExpect(jsonPath("$.items[0].selectedSize").value("M"))
                .andExpect(jsonPath("$.items[0].selectedColor").value("#000000"))
                .andExpect(jsonPath("$.subtotal").value(1600.0))
                .andExpect(jsonPath("$.shipping").value(0));

        mockMvc.perform(post("/api/cart/items")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"productId":%d,"quantity":1,"selectedSize":"M","selectedColor":"#ffffff"}
                                """.formatted(productId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemCount").value(2))
                .andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.items[0].selectedColor").value("#000000"))
                .andExpect(jsonPath("$.items[1].selectedSize").value("M"))
                .andExpect(jsonPath("$.items[1].selectedColor").value("#ffffff"))
                .andExpect(jsonPath("$.subtotal").value(3200.0))
                .andExpect(jsonPath("$.shipping").value(0));

        String orderJson = mockMvc.perform(post("/api/orders")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "shippingName":"Mira Kullanıcı",
                                  "shippingPhone":"05550000000",
                                  "shippingAddress":"MIRA Sokak No: 1",
                                  "shippingCity":"İstanbul",
                                  "shippingDistrict":"Kadıköy"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("Hazırlanıyor"))
                .andExpect(jsonPath("$.total").value(3200.0))
                .andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.items[0].productName").value("Sipariş Test Ürünü"))
                .andExpect(jsonPath("$.items[0].productImage").value("/products/test/siyah.png"))
                .andExpect(jsonPath("$.items[0].selectedSize").value("M"))
                .andExpect(jsonPath("$.items[0].selectedColor").value("#000000"))
                .andExpect(jsonPath("$.items[1].productImage").value("/products/test/beyaz.png"))
                .andExpect(jsonPath("$.items[1].selectedColor").value("#ffffff"))
                .andReturn().getResponse().getContentAsString();

        JsonNode order = objectMapper.readTree(orderJson);
        long orderId = order.get("id").asLong();

        mockMvc.perform(get("/api/orders")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(orderId));

        mockMvc.perform(get("/api/cart")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isEmpty())
                .andExpect(jsonPath("$.total").value(0));

        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock").value(3));

        mockMvc.perform(delete("/api/products/{id}", productId))
                .andExpect(status().isConflict());
    }
}
