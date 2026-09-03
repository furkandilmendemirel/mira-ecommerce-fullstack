package com.mira.api.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CartQuantityRequest(
        @NotNull(message = "Adet zorunludur")
        @Positive(message = "Adet en az 1 olmalıdır")
        @Max(value = 99, message = "Bir üründen en fazla 99 adet eklenebilir")
        Integer quantity
) {
}
