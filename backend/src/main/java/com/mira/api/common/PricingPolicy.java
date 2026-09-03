package com.mira.api.common;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PricingPolicy {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("1500.00");
    private static final BigDecimal SHIPPING_FEE = new BigDecimal("79.00");

    public BigDecimal shippingFor(BigDecimal subtotal) {
        if (subtotal.signum() == 0) return BigDecimal.ZERO;
        return subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_FEE;
    }

    public BigDecimal total(BigDecimal subtotal) {
        return subtotal.add(shippingFor(subtotal));
    }
}
