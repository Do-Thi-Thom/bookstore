package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.PageResponse;
import com.riki.bookstore.entity.Book;
import com.riki.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/books")
@RequiredArgsConstructor
@Tag(name = "Customer Book", description = "Customer book browsing APIs")
public class CustomerBookController {
    
    private final BookService bookService;
    
    @GetMapping
    @Operation(summary = "Get all books with pagination")
    public ApiResponse<PageResponse<Book>> getAllBooks(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Book> page = bookService.getAllBooks(pageable);
        PageResponse<Book> payload = new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID")
    public ApiResponse<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        
        return ApiResponse.success(book);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search books by title or author")
    public ApiResponse<PageResponse<Book>> searchBooks(
            @RequestParam String keyword,
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Book> page = bookService.searchBooks(keyword, pageable);
        PageResponse<Book> payload = new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get books by category")
    public ApiResponse<PageResponse<Book>> getBooksByCategory(
            @PathVariable Long categoryId,
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Book> page = bookService.getBooksByCategory(categoryId, pageable);
        PageResponse<Book> payload = new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }
    
    @GetMapping("/search/advanced")
    @Operation(summary = "Advanced search with category and keyword")
    public ApiResponse<PageResponse<Book>> advancedSearch(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Book> page = bookService.advancedSearch(categoryId, keyword, pageable);
        PageResponse<Book> payload = new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }

    @GetMapping("/latest")
    @Operation(summary = "Get newest books (sorted by createdAt desc)")
    public ApiResponse<PageResponse<Book>> getNewestBooks(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "6") int pageSize,
            @RequestParam(name = "categoryId", defaultValue = "-1") Long categoryId
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Book> page = bookService.getNewestBooks(pageable, categoryId);
        PageResponse<Book> payload = new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }
    
    @GetMapping("/featured")
    @Operation(summary = "Get featured books (sorted by sales quantity)")
    public ApiResponse<PageResponse<Book>> getFeaturedBooks(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "6") int pageSize,
            @RequestParam(name = "categoryId", defaultValue = "-1") Long categoryId
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Book> page = bookService.getFeaturedBooks(pageable, categoryId);
        PageResponse<Book> payload = new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }
}
