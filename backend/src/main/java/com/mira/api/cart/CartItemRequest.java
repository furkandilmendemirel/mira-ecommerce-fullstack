package com.mira.api.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CartItemRequest(
        @NotNull(message = "Ürün seçilmelidir")
        @Positive(message = "Ürün kimliği pozitif olmalıdır")
        Long productId,

        @NotNull(message = "Adet zorunludur")
        @Positive(message = "Adet en az 1 olmalıdır")
        @Max(value = 99, message = "Bir üründen en fazla 99 adet eklenebilir")
        Integer quantity,

        @Size(max = 20, message = "Beden değeri en fazla 20 karakter olabilir")
        String selectedSize,

        @Size(max = 20, message = "Renk değeri en fazla 20 karakter olabilir")
        String selectedColor
) {
}
