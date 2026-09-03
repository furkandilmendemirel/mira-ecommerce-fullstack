package com.mira.api.cart;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findAllByUserIdOrderByIdAsc(Long userId);
    Optional<CartItem> findByUserIdAndProductIdAndSelectedSizeAndSelectedColor(
            Long userId, Long productId, String selectedSize, String selectedColor);
    Optional<CartItem> findByIdAndUserId(Long id, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
    void deleteAllByUserId(Long userId);
    boolean existsByProductId(Long productId);
}
