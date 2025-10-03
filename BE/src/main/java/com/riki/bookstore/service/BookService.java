package com.riki.bookstore.service;

import com.riki.bookstore.dto.BookRequest;
import com.riki.bookstore.entity.Book;
import com.riki.bookstore.entity.Category;
import com.riki.bookstore.repository.BookRepository;
import com.riki.bookstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;
import com.riki.bookstore.dto.BookListResponse;

@Service
@RequiredArgsConstructor
public class BookService {
    
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    
    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }
    
    public BookListResponse getAllBooksWithStats(Pageable pageable) {
        Page<Book> page = bookRepository.findAll(pageable);
        
        // Calculate low stock books (stock < 5)
        int lowStockBooks = bookRepository.countByStockQuantityLessThan(5);
        
        // Calculate total inventory value
        BigDecimal totalInventoryValue = bookRepository.calculateTotalInventoryValue();
        
        return new BookListResponse(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                lowStockBooks,
                totalInventoryValue
        );
    }
    
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }
    
    public Book createBook(BookRequest bookRequest) {
        Category category = categoryRepository.findById(bookRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Book book = new Book();
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setPrice(BigDecimal.valueOf(bookRequest.getPrice()));
        book.setDescription(bookRequest.getDescription());
        book.setStockQuantity(bookRequest.getStockQuantity());
        book.setCategory(category);
        
        // Process cover image if provided
        if (bookRequest.getCoverImage() != null && !bookRequest.getCoverImage().isEmpty()) {
            String base64Image = convertImageToBase64(bookRequest.getCoverImage());
            book.setCoverImage(base64Image);
        }
        
        return bookRepository.save(book);
    }
    
    public Book updateBook(Long id, BookRequest bookRequest) {
        Book existingBook = getBookById(id);
        Category category = categoryRepository.findById(bookRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        existingBook.setTitle(bookRequest.getTitle());
        existingBook.setAuthor(bookRequest.getAuthor());
        existingBook.setPrice(BigDecimal.valueOf(bookRequest.getPrice()));
        existingBook.setDescription(bookRequest.getDescription());
        existingBook.setStockQuantity(bookRequest.getStockQuantity());
        existingBook.setCategory(category);
        
        // Process cover image if provided
        if (bookRequest.getCoverImage() != null && !bookRequest.getCoverImage().isEmpty()) {
            String base64Image = convertImageToBase64(bookRequest.getCoverImage());
            existingBook.setCoverImage(base64Image);
        }
        
        return bookRepository.save(existingBook);
    }
    
    public void deleteBook(Long id) {
        bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        // Check if book exists in any orders
        if (bookRepository.existsInOrders(id)) {
            throw new RuntimeException("Cannot delete book that exists in orders");
        }
        
        bookRepository.deleteById(id);
    }
    
    public List<Book> getLowStockBooks(Integer threshold) {
        return bookRepository.findByStockQuantityLessThanEqual(threshold);
    }
    
    public Page<Book> getLowStockBooksPaginated(Integer threshold, Pageable pageable) {
        return bookRepository.findByStockQuantityLessThanEqual(threshold, pageable);
    }
    
    public Page<Book> searchBooks(String keyword, Pageable pageable) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(keyword, pageable);
    }
    
    public Page<Book> getBooksByCategory(Long categoryId, Pageable pageable) {
        return bookRepository.findByCategoryId(categoryId, pageable);
    }
    
    public Page<Book> advancedSearch(Long categoryId, String keyword, Pageable pageable) {
        if (categoryId != null && keyword != null && !keyword.trim().isEmpty()) {
            return bookRepository.findByCategoryAndKeyword(categoryId, keyword, pageable);
        } else if (categoryId != null) {
            return bookRepository.findByCategoryId(categoryId, pageable);
        } else if (keyword != null && !keyword.trim().isEmpty()) {
            return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(keyword, pageable);
        } else {
            return bookRepository.findAll(pageable);
        }
    }
    
    public Page<Book> getNewestBooks(Pageable pageable, Long categoryId) {
        PageRequest sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("createdAt").descending()
        );

        if (categoryId != null && categoryId > 0) {
            return bookRepository.findByCategoryId(categoryId, sortedPageable);
        }

        return bookRepository.findAll(sortedPageable);
    }
    
    public Page<Book> getFeaturedBooks(Pageable pageable, Long categoryId) {
        return bookRepository.findFeaturedBooks(categoryId, pageable);
    }
    
    private String convertImageToBase64(MultipartFile file) {
        try {
            byte[] imageBytes = IOUtils.toByteArray(file.getInputStream());
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            return "data:" + file.getContentType() + ";base64," + base64Image;
        } catch (IOException e) {
            throw new RuntimeException("Error processing image", e);
        }
    }
}
