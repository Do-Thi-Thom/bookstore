package com.riki.bookstore.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.riki.bookstore.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private BigDecimal price;
    private String description;
    private String coverImage;
    private Integer stockQuantity;
    private CategoryResponse category;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    
    public static BookResponse fromBook(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setPrice(book.getPrice());
        response.setDescription(book.getDescription());
        response.setCoverImage(book.getCoverImage());
        response.setStockQuantity(book.getStockQuantity());
        response.setCreatedAt(book.getCreatedAt());
        response.setUpdatedAt(book.getUpdatedAt());
        
        if (book.getCategory() != null) {
            response.setCategory(CategoryResponse.fromCategory(book.getCategory()));
        }
        
        return response;
    }
}
