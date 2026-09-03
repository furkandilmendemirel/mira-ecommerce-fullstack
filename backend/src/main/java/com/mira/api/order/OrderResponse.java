package com.mira.api.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        Instant createdAt,
        String status,
        BigDecimal subtotal,
        BigDecimal shipping,
        BigDecimal total,
        ShippingAddressResponse shippingAddress,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(CustomerOrder order) {
        return new OrderResponse(order.getId(), "MR-%06d".formatted(order.getId()), order.getCreatedAt(),
                order.getStatus().label(), order.getSubtotal(), order.getShipping(), order.getTotal(),
                new ShippingAddressResponse(order.getShippingName(), order.getShippingPhone(),
                        order.getShippingAddress(), order.getShippingCity(), order.getShippingDistrict()),
                order.getItems().stream().map(OrderItemResponse::from).toList());
    }
}
