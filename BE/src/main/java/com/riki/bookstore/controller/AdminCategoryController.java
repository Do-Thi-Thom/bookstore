package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.CategoryResponse;
import com.riki.bookstore.dto.CategoryPageResponse;
import com.riki.bookstore.dto.CategoryCreateRequest;
import com.riki.bookstore.dto.CategoryUpdateRequest;
import com.riki.bookstore.entity.Category;
import com.riki.bookstore.repository.CategoryRepository;
import com.riki.bookstore.repository.BookRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Category Management", description = "Admin category management APIs")
public class AdminCategoryController {
    
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    
    @GetMapping
    @Operation(summary = "Get all categories")
    public ApiResponse<CategoryPageResponse> getAllCategories(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Category> page = categoryRepository.findAll(pageable);

        // Map categories to CategoryResponse with bookTotal
        List<CategoryResponse> categoryResponses = page.getContent().stream().map(category -> {
            long bookTotal = bookRepository.countByCategoryId(category.getId());
            CategoryResponse dto = new CategoryResponse(
                    category.getId(),
                    category.getName(),
                    category.getDescription(),
                    category.getCreatedAt(),
                    category.getUpdatedAt(),
                    bookTotal
            );
            return dto;
        }).toList();

        // Calculate aggregates across all categories (not paginated)
        long totalCategories = categoryRepository.count();
        long notEmptyAll = bookRepository.countDistinctCategoriesWithBooks();
        long emptyAll = totalCategories - notEmptyAll;

        CategoryPageResponse payload = new CategoryPageResponse(
                categoryResponses,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                emptyAll,
                notEmptyAll
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
    
    @PostMapping
    @Operation(summary = "Create new category")
    public ApiResponse<Category> createCategory(@Valid @RequestBody CategoryCreateRequest categoryRequest) {
        if (categoryRepository.existsByName(categoryRequest.getName())) {
            throw new RuntimeException("Category name already exists");
        }
        
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        
        Category savedCategory = categoryRepository.save(category);
        
        return ApiResponse.success("Category created successfully", savedCategory);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update category")
    public ApiResponse<Category> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryUpdateRequest categoryRequest) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        if (!category.getName().equals(categoryRequest.getName()) && 
            categoryRepository.existsByName(categoryRequest.getName())) {
            throw new RuntimeException("Category name already exists");
        }
        
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        
        Category updatedCategory = categoryRepository.save(category);
        
        return ApiResponse.success("Category updated successfully", updatedCategory);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        if (category.getBooks() != null && !category.getBooks().isEmpty()) {
            throw new RuntimeException("Cannot delete category with existing books");
        }
        
        categoryRepository.deleteById(id);
        
        return ApiResponse.success("Category deleted successfully", null);
    }
}
