package com.riki.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private BookStats bookStats;
    private OrderStats orderStats;
    private CustomerStats customerStats;
    private RevenueStats revenueStats;
    private List<OrderResponse> recentOrders;
    private List<BookResponse> lowStockBooks;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookStats {
        private long totalBooks;
        private double growthRate; // percentage change from last month
        private boolean isIncrease;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderStats {
        private long newOrders; // orders from this week
        private double growthRate; // percentage change from last week
        private boolean isIncrease;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerStats {
        private long totalCustomers;
        private double growthRate; // percentage change from last month
        private boolean isIncrease;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueStats {
        private BigDecimal monthlyRevenue;
        private double growthRate; // percentage change from last month
        private boolean isIncrease;
    }
}
