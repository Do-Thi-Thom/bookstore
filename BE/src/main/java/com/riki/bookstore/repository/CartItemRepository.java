package com.riki.bookstore.repository;

import com.riki.bookstore.entity.CartItem;
import com.riki.bookstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByUserAndIsDeletedFalse(User user);
    
    Optional<CartItem> findByUserAndBookIdAndIsDeletedFalse(User user, Long bookId);
    
    void deleteByUser(User user);
    
    // Soft delete methods
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE CartItem c SET c.isDeleted = true WHERE c.user = :user")
    void softDeleteByUser(User user);
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE CartItem c SET c.isDeleted = true WHERE c.id = :id")
    void softDeleteById(Long id);
}
