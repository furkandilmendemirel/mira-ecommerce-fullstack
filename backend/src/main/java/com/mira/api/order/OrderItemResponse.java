package com.mira.api.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String productName,
        String productImage,
        BigDecimal unitPrice,
        Integer quantity,
        String selectedSize,
        String selectedColor,
        BigDecimal lineTotal
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(item.getProduct().getId(), item.getProductName(), item.getProductImage(),
                item.getUnitPrice(), item.getQuantity(), item.getSelectedSize(), item.getSelectedColor(),
                item.getLineTotal());
    }
}
