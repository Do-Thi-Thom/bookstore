package com.riki.bookstore.dto;

import com.riki.bookstore.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookListResponse {
    
    private List<Book> books;
    private int pageIndex;
    private int pageSize;
    private long totalItems;
    private int totalPages;
    private int lowStockBooks; // Số sách có stock < 5
    private BigDecimal totalInventoryValue; // Tổng giá trị kho
}
