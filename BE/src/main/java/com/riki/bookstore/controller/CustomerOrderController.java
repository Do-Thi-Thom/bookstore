package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.PageResponse;
import com.riki.bookstore.dto.OrderCreateRequest;
import com.riki.bookstore.dto.OrderResponse;
import com.riki.bookstore.entity.*;
import com.riki.bookstore.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer/orders")
@RequiredArgsConstructor
@Tag(name = "Customer Order", description = "Customer order management APIs")
public class CustomerOrderController {
    
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderItemRepository orderItemRepository;
    
    @GetMapping
    @Operation(summary = "Get user's order history")
    public ApiResponse<PageResponse<OrderResponse>> getOrderHistory(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Order> page = orderRepository.findByUser(user, pageable);
        
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
    
    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Long id) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }
        
        return ApiResponse.success(OrderResponse.fromOrder(order));
    }
    
    @PostMapping("/create")
    @Operation(summary = "Create new order from cart")
    @Transactional
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody OrderCreateRequest orderRequest) {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUserAndIsDeletedFalse(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Calculate total amount
        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setRecipientName(orderRequest.getRecipientName());
        order.setRecipientPhone(orderRequest.getRecipientPhone());
        order.setRecipientAddress(orderRequest.getRecipientAddress());
        order.setTotalAmount(totalAmount);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setNotes(orderRequest.getNotes());
        
        Order savedOrder = orderRepository.save(order);
        
        // Create order items and update book stock
        for (CartItem cartItem : cartItems) {
            Book book = cartItem.getBook();
            
            if (book.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
            }
            
            // Update book stock
            book.setStockQuantity(book.getStockQuantity() - cartItem.getQuantity());
            bookRepository.save(book);
            
            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setBook(book);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(book.getPrice());
            
            // Save order item
            orderItemRepository.save(orderItem);
        }
        
        // Clear cart (soft delete)
        cartItemRepository.softDeleteByUser(user);
        
        return ApiResponse.success("Order created successfully", OrderResponse.fromOrder(savedOrder));
    }
    
    @GetMapping("/status/{orderNumber}")
    @Operation(summary = "Check order status by order number")
    public ApiResponse<OrderResponse> checkOrderStatus(@PathVariable String orderNumber) {
        User user = getCurrentUser();
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }
        
        return ApiResponse.success(OrderResponse.fromOrder(order));
    }
    
    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
