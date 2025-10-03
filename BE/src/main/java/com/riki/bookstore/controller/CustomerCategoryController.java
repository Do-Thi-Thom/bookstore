package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.PageResponse;
import com.riki.bookstore.entity.Category;
import com.riki.bookstore.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/categories")
@RequiredArgsConstructor
@Tag(name = "Customer Category", description = "Customer category browsing APIs")
public class CustomerCategoryController {
    
    private final CategoryRepository categoryRepository;
    
    @GetMapping
    @Operation(summary = "Get all categories")
    public ApiResponse<PageResponse<Category>> getAllCategories(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Category> page = categoryRepository.findAll(pageable);
        PageResponse<Category> payload = new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ApiResponse<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        return ApiResponse.success(category);
    }
}
