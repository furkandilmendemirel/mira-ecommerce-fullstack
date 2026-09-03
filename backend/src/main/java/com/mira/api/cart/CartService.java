package com.mira.api.cart;

import com.mira.api.auth.CurrentUserService;
import com.mira.api.common.InvalidRequestException;
import com.mira.api.common.PricingPolicy;
import com.mira.api.common.ResourceNotFoundException;
import com.mira.api.product.Product;
import com.mira.api.product.ProductRepository;
import com.mira.api.product.ProductResponse;
import com.mira.api.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;
    private final PricingPolicy pricingPolicy;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository,
                       CurrentUserService currentUserService, PricingPolicy pricingPolicy) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.currentUserService = currentUserService;
        this.pricingPolicy = pricingPolicy;
    }

    public CartResponse get(String authorizationHeader) {
        return response(cartItemRepository.findAllByUserIdOrderByIdAsc(
                currentUserService.require(authorizationHeader).getId()));
    }

    @Transactional
    public CartResponse upsert(String authorizationHeader, CartItemRequest request) {
        User user = currentUserService.require(authorizationHeader);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + request.productId()));
        String selectedSize = validateAndNormalizeSize(product, request.selectedSize());
        String selectedColor = validateAndNormalizeColor(product, request.selectedColor());

        CartItem item = cartItemRepository
                .findByUserIdAndProductIdAndSelectedSizeAndSelectedColor(
                        user.getId(), product.getId(), selectedSize, selectedColor)
                .orElseGet(() -> new CartItem(user, product, request.quantity(), selectedSize, selectedColor));
        validateCartStock(user.getId(), product, request.quantity(), item.getId());
        item.setQuantity(request.quantity());
        item.setSelectedSize(selectedSize);
        item.setSelectedColor(selectedColor);
        cartItemRepository.save(item);
        return response(cartItemRepository.findAllByUserIdOrderByIdAsc(user.getId()));
    }

    @Transactional
    public CartResponse changeQuantity(String authorizationHeader, Long itemId, CartQuantityRequest request) {
        User user = currentUserService.require(authorizationHeader);
        CartItem item = cartItemRepository.findByIdAndUserId(itemId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sepet kalemi bulunamadı: " + itemId));
        validateCartStock(user.getId(), item.getProduct(), request.quantity(), item.getId());
        item.setQuantity(request.quantity());
        return response(cartItemRepository.findAllByUserIdOrderByIdAsc(user.getId()));
    }

    @Transactional
    public void remove(String authorizationHeader, Long itemId) {
        User user = currentUserService.require(authorizationHeader);
        if (cartItemRepository.findByIdAndUserId(itemId, user.getId()).isEmpty()) {
            throw new ResourceNotFoundException("Sepet kalemi bulunamadı: " + itemId);
        }
        cartItemRepository.deleteByIdAndUserId(itemId, user.getId());
    }

    @Transactional
    public void clear(String authorizationHeader) {
        cartItemRepository.deleteAllByUserId(currentUserService.require(authorizationHeader).getId());
    }

    private void validateCartStock(Long userId, Product product, int requestedQuantity, Long currentItemId) {
        int otherVariantQuantity = cartItemRepository.findAllByUserIdOrderByIdAsc(userId).stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .filter(item -> currentItemId == null || !item.getId().equals(currentItemId))
                .mapToInt(CartItem::getQuantity)
                .sum();
        if (otherVariantQuantity + requestedQuantity > product.getStock()) {
            throw new InvalidRequestException(product.getName() + " için yalnızca " + product.getStock() + " adet stok var");
        }
    }

    private String validateAndNormalizeSize(Product product, String selectedSize) {
        if (product.getSizes().isEmpty()) return null;

        String normalized = selectedSize == null ? "" : selectedSize.trim();
        if (normalized.isBlank()) {
            throw new InvalidRequestException(product.getName() + " için beden seçmelisiniz");
        }
        if (!product.getSizes().contains(normalized)) {
            throw new InvalidRequestException("Geçersiz beden: " + normalized);
        }
        return normalized;
    }

    private String validateAndNormalizeColor(Product product, String selectedColor) {
        if (product.getColors().isEmpty()) return null;

        String normalized = selectedColor == null ? "" : selectedColor.trim().toLowerCase();
        if (normalized.isBlank()) {
            throw new InvalidRequestException(product.getName() + " için renk seçmelisiniz");
        }
        if (!product.getColors().contains(normalized)) {
            throw new InvalidRequestException("Geçersiz renk: " + normalized);
        }
        return normalized;
    }

    private CartResponse response(List<CartItem> cartItems) {
        List<CartItemResponse> items = cartItems.stream()
                .map(item -> new CartItemResponse(item.getId(), ProductResponse.from(item.getProduct()), item.getQuantity(),
                        item.getSelectedSize(), item.getSelectedColor(),
                        item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))))
                .toList();
        BigDecimal subtotal = items.stream().map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shipping = pricingPolicy.shippingFor(subtotal);
        int itemCount = items.stream().mapToInt(CartItemResponse::quantity).sum();
        return new CartResponse(items, itemCount, subtotal, shipping, subtotal.add(shipping));
    }
}
