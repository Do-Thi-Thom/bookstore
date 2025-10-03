package com.riki.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BookRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    
    private String description;
    
    private MultipartFile coverImage;
    
    @NotNull(message = "Stock quantity is required")
    @Positive(message = "Stock quantity must be positive")
    private Integer stockQuantity;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
