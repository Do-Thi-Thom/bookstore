package com.riki.bookstore.repository;

import com.riki.bookstore.entity.Book;
import com.riki.bookstore.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    Page<Book> findByCategory(Category category, Pageable pageable);
    
    Page<Book> findByCategoryId(Long categoryId, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE " +
           "(:categoryId IS NULL OR b.category.id = :categoryId) AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Book> findByCategoryAndKeyword(@Param("categoryId") Long categoryId, 
                                       @Param("keyword") String keyword, 
                                       Pageable pageable);
    
    List<Book> findByStockQuantityLessThanEqual(Integer quantity);
    
    Page<Book> findByStockQuantityLessThanEqual(Integer quantity, Pageable pageable);
    
    int countByStockQuantityLessThan(Integer quantity);
    
    long countByCategoryId(Long categoryId);

    @Query("SELECT COUNT(DISTINCT b.category.id) FROM Book b")
    long countDistinctCategoriesWithBooks();
    
    @Query("SELECT COALESCE(SUM(b.price * b.stockQuantity), 0) FROM Book b")
    BigDecimal calculateTotalInventoryValue();
    
    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi WHERE oi.book.id = :bookId")
    boolean existsInOrders(@Param("bookId") Long bookId);
    
    // Featured books - based on sales quantity
    @Query("SELECT b FROM Book b " +
           "LEFT JOIN OrderItem oi ON b.id = oi.book.id " +
           "WHERE (:categoryId = -1 OR b.category.id = :categoryId) " +
           "GROUP BY b.id " +
           "ORDER BY COALESCE(SUM(oi.quantity), 0) DESC, b.createdAt DESC")
    Page<Book> findFeaturedBooks(@Param("categoryId") Long categoryId, Pageable pageable);
    
    // Dashboard statistics methods
    @Query("SELECT COUNT(b) FROM Book b WHERE b.createdAt >= :startDate")
    long countBooksCreatedAfter(@Param("startDate") java.time.LocalDateTime startDate);
    
    @Query("SELECT b FROM Book b WHERE b.stockQuantity <= 5 ORDER BY b.stockQuantity ASC")
    List<Book> findLowStockBooks();
}
