package com.mira.api.order;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> findAll(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return orderService.findAll(authorization);
    }

    @GetMapping("/{id}")
    public OrderResponse findById(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @PathVariable Long id) {
        return orderService.findById(authorization, id);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse created = orderService.create(authorization, request);
        return ResponseEntity.created(URI.create("/api/orders/" + created.id())).body(created);
    }
}
