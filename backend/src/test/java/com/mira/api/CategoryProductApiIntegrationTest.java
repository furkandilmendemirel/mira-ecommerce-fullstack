package com.mira.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CategoryProductApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void categoryAndProductCrudFlowWorks() throws Exception {
        String categoryJson = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Giyim","description":"MIRA giyim ürünleri"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Giyim"))
                .andReturn().getResponse().getContentAsString();

        JsonNode category = objectMapper.readTree(categoryJson);
        long categoryId = category.get("id").asLong();

        String productJson = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name":"Basic T-Shirt",
                                  "description":"Pamuklu tişört",
                                  "price":599.90,
                                  "stock":25,
                                  "categoryId":%d
                                }
                                """.formatted(categoryId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.category_id").value(categoryId))
                .andReturn().getResponse().getContentAsString();

        long productId = objectMapper.readTree(productJson).get("id").asLong();

        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Basic T-Shirt"));

        mockMvc.perform(get("/api/products")
                        .param("category", String.valueOf(categoryId))
                        .param("filter", "shirt")
                        .param("sort", "price:asc")
                        .param("limit", "8")
                        .param("offset", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.products[0].name").value("Basic T-Shirt"));

        mockMvc.perform(delete("/api/categories/{id}", categoryId))
                .andExpect(status().isConflict());

        mockMvc.perform(delete("/api/products/{id}", productId))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/categories/{id}", categoryId))
                .andExpect(status().isNoContent());
    }

    @Test
    void invalidProductReturnsFieldErrors() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","price":-1,"stock":-2}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.name").exists())
                .andExpect(jsonPath("$.validationErrors.price").exists())
                .andExpect(jsonPath("$.validationErrors.stock").exists())
                .andExpect(jsonPath("$.validationErrors.categoryId").exists());
    }
}
