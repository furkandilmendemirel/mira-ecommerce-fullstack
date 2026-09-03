package com.mira.api.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        Integer itemCount,
        BigDecimal subtotal,
        BigDecimal shipping,
        BigDecimal total
) {
}
