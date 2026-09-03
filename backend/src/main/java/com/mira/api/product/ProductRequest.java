package com.mira.api.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record ProductRequest(
        @NotBlank(message = "Ürün adı zorunludur")
        @Size(max = 160, message = "Ürün adı en fazla 160 karakter olabilir")
        String name,

        @Size(max = 2000, message = "Açıklama en fazla 2000 karakter olabilir")
        String description,

        @NotNull(message = "Fiyat zorunludur")
        @DecimalMin(value = "0.0", inclusive = false, message = "Fiyat sıfırdan büyük olmalıdır")
        BigDecimal price,

        @NotNull(message = "Stok zorunludur")
        @PositiveOrZero(message = "Stok negatif olamaz")
        Integer stock,

        @NotNull(message = "Kategori zorunludur")
        @Positive(message = "Geçerli bir kategori seçilmelidir")
        Long categoryId,

        @Positive(message = "Mağaza kimliği pozitif olmalıdır")
        Integer storeId,

        @DecimalMin(value = "0.0", message = "Puan 0'dan küçük olamaz")
        @DecimalMax(value = "5.0", message = "Puan 5'ten büyük olamaz")
        BigDecimal rating,

        @PositiveOrZero(message = "Satış sayısı negatif olamaz")
        Integer sellCount,

        List<@NotBlank(message = "Görsel adresi boş olamaz") String> images,

        List<@NotBlank(message = "Beden değeri boş olamaz")
                @Size(max = 20, message = "Beden değeri en fazla 20 karakter olabilir") String> sizes,

        List<@NotBlank(message = "Renk değeri boş olamaz")
                @Size(max = 20, message = "Renk değeri en fazla 20 karakter olabilir") String> colors,

        Map<String, String> colorImages
) {
}
