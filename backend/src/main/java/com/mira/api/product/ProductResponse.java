package com.mira.api.product;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.IntStream;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer stock,
        @JsonProperty("store_id") Integer storeId,
        @JsonProperty("category_id") Long categoryId,
        @JsonProperty("category_code") String categoryCode,
        @JsonProperty("category_title") String categoryTitle,
        BigDecimal rating,
        @JsonProperty("sell_count") Integer sellCount,
        List<ProductImageResponse> images,
        List<String> sizes,
        List<String> colors,
        Map<String, String> colorImages
) {
    public static ProductResponse from(Product product) {
        List<ProductImageResponse> images = IntStream.range(0, product.getImages().size())
                .mapToObj(index -> new ProductImageResponse(product.getImages().get(index), index))
                .toList();
        return new ProductResponse(product.getId(), product.getName(), product.getDescription(),
                product.getPrice(), product.getStock(), Objects.requireNonNullElse(product.getStoreId(), 1),
                product.getCategory().getId(), product.getCategory().getCode(), product.getCategory().getName(),
                Objects.requireNonNullElse(product.getRating(), new BigDecimal("4.50")),
                Objects.requireNonNullElse(product.getSellCount(), 0), images, List.copyOf(product.getSizes()),
                List.copyOf(product.getColors()), Map.copyOf(product.getColorImages()));
    }
}
