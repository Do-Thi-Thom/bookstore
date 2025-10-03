package com.riki.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderPageResponse {
    private List<OrderResponse> items;
    private int pageIndex;
    private int pageSize;
    private long totalItems;
    private int totalPages;
    
    // Statistics fields
    private long pendingOrders;
    private long processingOrders;
    private BigDecimal totalRevenue;
}
