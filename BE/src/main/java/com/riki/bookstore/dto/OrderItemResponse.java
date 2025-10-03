package com.riki.bookstore.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.riki.bookstore.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookCoverImage;
    private Integer quantity;
    private BigDecimal price;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    
    public static OrderItemResponse fromOrderItem(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(orderItem.getId());
        response.setBookId(orderItem.getBook().getId());
        response.setBookTitle(orderItem.getBook().getTitle());
        response.setBookAuthor(orderItem.getBook().getAuthor());
        response.setBookCoverImage(orderItem.getBook().getCoverImage());
        response.setQuantity(orderItem.getQuantity());
        response.setPrice(orderItem.getPrice());
        response.setCreatedAt(orderItem.getCreatedAt());
        response.setUpdatedAt(orderItem.getUpdatedAt());
        
        return response;
    }
}
