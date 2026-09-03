package com.mira.api.order;

public record ShippingAddressResponse(
        String name,
        String phone,
        String address,
        String city,
        String district
) {
}
