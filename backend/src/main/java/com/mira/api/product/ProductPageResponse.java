package com.mira.api.product;

import java.util.List;

public record ProductPageResponse(List<ProductResponse> products, long total) {
}
