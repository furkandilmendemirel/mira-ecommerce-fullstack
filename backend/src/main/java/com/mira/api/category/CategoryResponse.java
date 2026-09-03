package com.mira.api.category;

import java.math.BigDecimal;

public record CategoryResponse(
        Long id,
        String code,
        String title,
        String img,
        BigDecimal rating,
        String gender
) {
}
