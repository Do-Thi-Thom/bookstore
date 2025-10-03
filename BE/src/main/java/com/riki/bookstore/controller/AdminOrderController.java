package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.PageResponse;
import com.riki.bookstore.dto.OrderResponse;
import com.riki.bookstore.dto.AdminOrderPageResponse;
import com.riki.bookstore.entity.Order;
import com.riki.bookstore.repository.OrderRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Order Management", description = "Admin order management APIs")
public class AdminOrderController {
    
    private final OrderRepository orderRepository;
    
    @GetMapping
    @Operation(summary = "Get all orders with pagination and statistics")
    public ApiResponse<AdminOrderPageResponse> getAllOrders(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Order> page = orderRepository.findAll(pageable);
        
        List<OrderResponse> orderResponses = page.getContent().stream()
                .map(OrderResponse::fromOrder)
                .toList();
        
        // Calculate statistics
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long processingOrders = orderRepository.countByStatus(Order.OrderStatus.PROCESSING);
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        
        AdminOrderPageResponse payload = new AdminOrderPageResponse(
                orderResponses,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                pendingOrders,
                processingOrders,
                totalRevenue
        );
        
        return ApiResponse.success(payload);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        return ApiResponse.success(OrderResponse.fromOrder(order));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get orders by status")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersByStatus(
            @PathVariable Order.OrderStatus status,
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Order> page = orderRepository.findByStatus(status, pageable);
        
        List<OrderResponse> orderResponses = page.getContent().stream()
                .map(OrderResponse::fromOrder)
                .toList();
        
        PageResponse<OrderResponse> payload = new PageResponse<>(
                orderResponses,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestParam Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        
        return ApiResponse.success("Order status updated successfully", OrderResponse.fromOrder(updatedOrder));
    }
}
