package com.riki.bookstore.service;

import com.riki.bookstore.dto.BookResponse;
import com.riki.bookstore.dto.DashboardStatsResponse;
import com.riki.bookstore.dto.OrderResponse;
import com.riki.bookstore.entity.Book;
import com.riki.bookstore.entity.Order;
import com.riki.bookstore.repository.BookRepository;
import com.riki.bookstore.repository.OrderRepository;
import com.riki.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    
    public DashboardStatsResponse getDashboardStats() {
        LocalDateTime now = LocalDateTime.now();
        
        // Calculate date ranges
        LocalDateTime thisMonthStart = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime lastMonthStart = thisMonthStart.minusMonths(1);
        LocalDateTime thisWeekStart = now.with(java.time.DayOfWeek.MONDAY).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime lastWeekStart = thisWeekStart.minusWeeks(1);
        
        // Book statistics
        long totalBooks = bookRepository.count();
        long booksThisMonth = bookRepository.countBooksCreatedAfter(thisMonthStart);
        long booksLastMonth = bookRepository.countBooksCreatedAfter(lastMonthStart);
        double bookGrowthRate = calculateGrowthRate(booksThisMonth, booksLastMonth);
        
        // Order statistics
        long newOrdersThisWeek = orderRepository.countOrdersCreatedAfter(thisWeekStart);
        long newOrdersLastWeek = orderRepository.countOrdersCreatedAfter(lastWeekStart);
        double orderGrowthRate = calculateGrowthRate(newOrdersThisWeek, newOrdersLastWeek);
        
        // Customer statistics
        long totalCustomers = userRepository.countByRole(com.riki.bookstore.entity.User.Role.USER);
        long customersThisMonth = userRepository.countUsersCreatedAfter(thisMonthStart);
        long customersLastMonth = userRepository.countUsersCreatedAfter(lastMonthStart);
        double customerGrowthRate = calculateGrowthRate(customersThisMonth, customersLastMonth);
        
        // Revenue statistics
        BigDecimal monthlyRevenue = orderRepository.calculateRevenueAfter(thisMonthStart);
        BigDecimal lastMonthRevenue = orderRepository.calculateRevenueAfter(lastMonthStart);
        double revenueGrowthRate = calculateGrowthRate(monthlyRevenue, lastMonthRevenue);
        
        // Recent orders (5 most recent)
        List<Order> recentOrders = orderRepository.findRecentOrders(PageRequest.of(0, 5));
        List<OrderResponse> recentOrderResponses = recentOrders.stream()
                .map(OrderResponse::fromOrder)
                .toList();
        
        // Low stock books (5 books with stock <= 5)
        List<BookResponse> lowStockBooks = bookRepository.findLowStockBooks().stream()
                .limit(5)
                .map(BookResponse::fromBook)
                .toList();
        
        return new DashboardStatsResponse(
                new DashboardStatsResponse.BookStats(totalBooks, bookGrowthRate, bookGrowthRate > 0),
                new DashboardStatsResponse.OrderStats(newOrdersThisWeek, orderGrowthRate, orderGrowthRate > 0),
                new DashboardStatsResponse.CustomerStats(totalCustomers, customerGrowthRate, customerGrowthRate > 0),
                new DashboardStatsResponse.RevenueStats(monthlyRevenue, revenueGrowthRate, revenueGrowthRate > 0),
                recentOrderResponses,
                lowStockBooks
        );
    }
    
    private double calculateGrowthRate(long current, long previous) {
        if (previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return ((double) (current - previous) / previous) * 100;
    }
    
    private double calculateGrowthRate(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous).divide(previous, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }
}
