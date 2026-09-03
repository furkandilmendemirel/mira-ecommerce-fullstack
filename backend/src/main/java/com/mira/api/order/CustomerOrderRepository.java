package com.mira.api.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findAllByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<CustomerOrder> findByIdAndUserId(Long id, Long userId);
}
