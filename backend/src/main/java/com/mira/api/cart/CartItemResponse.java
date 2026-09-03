package com.mira.api.cart;

import com.mira.api.product.ProductResponse;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        ProductResponse product,
        Integer quantity,
        String selectedSize,
        String selectedColor,
        BigDecimal lineTotal
) {
}
