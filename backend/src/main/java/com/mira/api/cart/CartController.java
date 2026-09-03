package com.mira.api.cart;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartResponse get(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return cartService.get(authorization);
    }

    @PostMapping("/items")
    public CartResponse upsert(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                               @Valid @RequestBody CartItemRequest request) {
        return cartService.upsert(authorization, request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponse changeQuantity(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @PathVariable Long itemId,
            @Valid @RequestBody CartQuantityRequest request) {
        return cartService.changeQuantity(authorization, itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> remove(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @PathVariable Long itemId) {
        cartService.remove(authorization, itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clear(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        cartService.clear(authorization);
        return ResponseEntity.noContent().build();
    }
}
