package com.mira.api.order;

import com.mira.api.auth.CurrentUserService;
import com.mira.api.cart.CartItem;
import com.mira.api.cart.CartItemRepository;
import com.mira.api.common.InvalidRequestException;
import com.mira.api.common.PricingPolicy;
import com.mira.api.common.ResourceNotFoundException;
import com.mira.api.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final CustomerOrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final CurrentUserService currentUserService;
    private final PricingPolicy pricingPolicy;

    public OrderService(CustomerOrderRepository orderRepository, CartItemRepository cartItemRepository,
                        CurrentUserService currentUserService, PricingPolicy pricingPolicy) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.currentUserService = currentUserService;
        this.pricingPolicy = pricingPolicy;
    }

    public List<OrderResponse> findAll(String authorizationHeader) {
        Long userId = currentUserService.require(authorizationHeader).getId();
        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse findById(String authorizationHeader, Long id) {
        Long userId = currentUserService.require(authorizationHeader).getId();
        CustomerOrder order = orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı: " + id));
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse create(String authorizationHeader, CreateOrderRequest request) {
        User user = currentUserService.require(authorizationHeader);
        List<CartItem> cartItems = cartItemRepository.findAllByUserIdOrderByIdAsc(user.getId());
        if (cartItems.isEmpty()) throw new InvalidRequestException("Sipariş oluşturmak için sepette ürün olmalıdır");

        for (CartItem cartItem : cartItems) {
            if (cartItem.getQuantity() > cartItem.getProduct().getStock()) {
                throw new InvalidRequestException(cartItem.getProduct().getName() + " için yeterli stok yok");
            }
            if (!cartItem.getProduct().getSizes().isEmpty()
                    && (cartItem.getSelectedSize() == null || cartItem.getSelectedSize().isBlank())) {
                throw new InvalidRequestException(cartItem.getProduct().getName() + " için beden seçmelisiniz");
            }
            if (!cartItem.getProduct().getColors().isEmpty()
                    && (cartItem.getSelectedColor() == null || cartItem.getSelectedColor().isBlank())) {
                throw new InvalidRequestException(cartItem.getProduct().getName() + " için renk seçmelisiniz");
            }
        }

        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shipping = pricingPolicy.shippingFor(subtotal);
        CustomerOrder order = new CustomerOrder(user, request, subtotal, shipping, subtotal.add(shipping));

        for (CartItem cartItem : cartItems) {
            order.addItem(new OrderItem(order, cartItem.getProduct(), cartItem.getQuantity(),
                    cartItem.getSelectedSize(), cartItem.getSelectedColor()));
            cartItem.getProduct().setStock(cartItem.getProduct().getStock() - cartItem.getQuantity());
        }

        CustomerOrder saved = orderRepository.save(order);
        cartItemRepository.deleteAllByUserId(user.getId());
        return OrderResponse.from(saved);
    }
}
