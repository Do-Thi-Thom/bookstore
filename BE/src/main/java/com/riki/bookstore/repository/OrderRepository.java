package com.riki.bookstore.repository;

import com.riki.bookstore.entity.Order;
import com.riki.bookstore.entity.User;
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
    
    Page<Order> findByUser(User user, Pageable pageable);
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
    
    // Statistics methods
    long countByStatus(Order.OrderStatus status);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    BigDecimal calculateTotalRevenue();
    
    // Dashboard statistics methods
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersCreatedAfter(@Param("startDate") java.time.LocalDateTime startDate);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt >= :startDate")
    BigDecimal calculateRevenueAfter(@Param("startDate") java.time.LocalDateTime startDate);
    
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(Pageable pageable);
}
