package com.shopsphere.repository;

import com.shopsphere.entity.Order;
import com.shopsphere.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<Order> findByIdAndUserId(Long id, Long userId);

    Optional<Order> findByOrderNumber(String orderNumber);

    long countByOrderStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderStatus <> com.shopsphere.enums.OrderStatus.CANCELLED")
    BigDecimal calculateTotalRevenue();

    List<Order> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o GROUP BY o.orderStatus")
    List<Object[]> countOrdersByStatusGroup();

    @Query("SELECT oi.productNameSnapshot, SUM(oi.quantity), SUM(oi.lineTotal) " +
           "FROM OrderItem oi JOIN oi.order o " +
           "WHERE o.orderStatus <> com.shopsphere.enums.OrderStatus.CANCELLED " +
           "GROUP BY oi.productNameSnapshot " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProducts(Pageable pageable);
}
