package com.mira.api.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotBlank(message = "Teslimat adı zorunludur")
        @Size(max = 120, message = "Teslimat adı en fazla 120 karakter olabilir")
        String shippingName,

        @NotBlank(message = "Telefon zorunludur")
        @Size(max = 30, message = "Telefon en fazla 30 karakter olabilir")
        String shippingPhone,

        @NotBlank(message = "Adres zorunludur")
        @Size(max = 1000, message = "Adres en fazla 1000 karakter olabilir")
        String shippingAddress,

        @NotBlank(message = "İl zorunludur")
        @Size(max = 100, message = "İl en fazla 100 karakter olabilir")
        String shippingCity,

        @NotBlank(message = "İlçe zorunludur")
        @Size(max = 100, message = "İlçe en fazla 100 karakter olabilir")
        String shippingDistrict
) {
}
