package com.mira.api.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CategoryRequest(
        @NotBlank(message = "Kategori adı zorunludur")
        @Size(max = 100, message = "Kategori adı en fazla 100 karakter olabilir")
        String name,

        @Size(max = 500, message = "Açıklama en fazla 500 karakter olabilir")
        String description,

        @Size(max = 80, message = "Kategori kodu en fazla 80 karakter olabilir")
        String code,

        @Size(max = 1000, message = "Görsel adresi en fazla 1000 karakter olabilir")
        String img,

        @DecimalMin(value = "0.0", message = "Puan 0'dan küçük olamaz")
        @DecimalMax(value = "5.0", message = "Puan 5'ten büyük olamaz")
        BigDecimal rating,

        @Pattern(regexp = "k|e", message = "Cinsiyet k veya e olmalıdır")
        String gender
) {
}
