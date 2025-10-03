package com.riki.bookstore.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.riki.bookstore.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;
    private BigDecimal totalAmount;
    private String status;
    private String statusDisplayName;
    private String notes;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    
    private List<OrderItemResponse> orderItems;
    
    public static OrderResponse fromOrder(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setRecipientName(order.getRecipientName());
        response.setRecipientPhone(order.getRecipientPhone());
        response.setRecipientAddress(order.getRecipientAddress());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus().name());
        response.setStatusDisplayName(order.getStatus().getDisplayName());
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        
        if (order.getOrderItems() != null) {
            response.setOrderItems(order.getOrderItems().stream()
                    .map(OrderItemResponse::fromOrderItem)
                    .toList());
        }
        
        return response;
    }
}
