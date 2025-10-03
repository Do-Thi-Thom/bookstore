package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.BookRequest;
import com.riki.bookstore.dto.BookListResponse;
import com.riki.bookstore.dto.PageResponse;
import com.riki.bookstore.entity.Book;
import com.riki.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Book Management", description = "Admin book management APIs")
public class AdminBookController {
    
    private final BookService bookService;
    
    @GetMapping
    @Operation(summary = "Get all books with pagination and statistics")
    public ApiResponse<BookListResponse> getAllBooks(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        BookListResponse response = bookService.getAllBooksWithStats(pageable);
        
        return ApiResponse.success(response);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID")
    public ApiResponse<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        
        return ApiResponse.success(book);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create new book with image upload")
    public ApiResponse<Book> createBook(@Valid @ModelAttribute BookRequest bookRequest) {
        Book savedBook = bookService.createBook(bookRequest);
        
        return ApiResponse.success("Book created successfully", savedBook);
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update book with image upload")
    public ApiResponse<Book> updateBook(@PathVariable Long id, @Valid @ModelAttribute BookRequest bookRequest) {
        Book updatedBook = bookService.updateBook(id, bookRequest);
        
        return ApiResponse.success("Book updated successfully", updatedBook);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete book")
    public ApiResponse<Void> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ApiResponse.success("Book deleted successfully", null);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/low-stock")
    @Operation(summary = "Get books with low stock")
    public ApiResponse<List<Book>> getLowStockBooks(@RequestParam(defaultValue = "10") Integer threshold) {
        List<Book> books = bookService.getLowStockBooks(threshold);
        
        return ApiResponse.success(books);
    }
}
