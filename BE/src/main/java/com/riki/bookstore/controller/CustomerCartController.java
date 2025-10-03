package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.CartItemResponse;
import com.riki.bookstore.entity.CartItem;
import com.riki.bookstore.entity.User;
import com.riki.bookstore.repository.BookRepository;
import com.riki.bookstore.repository.CartItemRepository;
import com.riki.bookstore.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/cart")
@RequiredArgsConstructor
@Tag(name = "Customer Cart", description = "Customer cart management APIs")
public class CustomerCartController {
    
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    
    @GetMapping
    @Operation(summary = "Get user's cart items")
    public ApiResponse<List<CartItemResponse>> getCartItems() {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUserAndIsDeletedFalse(user);
        
        List<CartItemResponse> cartItemResponses = cartItems.stream()
                .map(cartItem -> new CartItemResponse(
                        cartItem.getId(),
                        cartItem.getBook().getId(),
                        cartItem.getBook().getTitle(),
                        cartItem.getBook().getAuthor(),
                        cartItem.getBook().getPrice(),
                        cartItem.getBook().getCoverImage(),
                        cartItem.getQuantity(),
                        cartItem.getCreatedAt(),
                        cartItem.getUpdatedAt()
                ))
                .toList();
        
        return ApiResponse.success(cartItemResponses);
    }
    
    @PostMapping("/add")
    @Operation(summary = "Add book to cart")
    public ApiResponse<CartItemResponse> addToCart(@RequestParam Long bookId, @RequestParam Integer quantity) {
        User user = getCurrentUser();
        
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        CartItem existingItem = cartItemRepository.findByUserAndBookIdAndIsDeletedFalse(user, bookId).orElse(null);
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            CartItem updatedItem = cartItemRepository.save(existingItem);
            
            CartItemResponse response = new CartItemResponse(
                    updatedItem.getId(),
                    updatedItem.getBook().getId(),
                    updatedItem.getBook().getTitle(),
                    updatedItem.getBook().getAuthor(),
                    updatedItem.getBook().getPrice(),
                    updatedItem.getBook().getCoverImage(),
                    updatedItem.getQuantity(),
                    updatedItem.getCreatedAt(),
                    updatedItem.getUpdatedAt()
            );
            
            return ApiResponse.success("Book quantity updated in cart", response);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setBook(bookRepository.findById(bookId).get());
            newItem.setQuantity(quantity);
            
            CartItem savedItem = cartItemRepository.save(newItem);
            
            CartItemResponse response = new CartItemResponse(
                    savedItem.getId(),
                    savedItem.getBook().getId(),
                    savedItem.getBook().getTitle(),
                    savedItem.getBook().getAuthor(),
                    savedItem.getBook().getPrice(),
                    savedItem.getBook().getCoverImage(),
                    savedItem.getQuantity(),
                    savedItem.getCreatedAt(),
                    savedItem.getUpdatedAt()
            );
            
            return ApiResponse.success("Book added to cart", response);
        }
    }
    
    @PutMapping("/update/{cartItemId}")
    @Operation(summary = "Update cart item quantity")
    public ApiResponse<CartItemResponse> updateCartItem(@PathVariable Long cartItemId, @RequestParam Integer quantity) {
        User user = getCurrentUser();
        
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to cart item");
        }
        
        cartItem.setQuantity(quantity);
        CartItem updatedItem = cartItemRepository.save(cartItem);
        
        CartItemResponse response = new CartItemResponse(
                updatedItem.getId(),
                updatedItem.getBook().getId(),
                updatedItem.getBook().getTitle(),
                updatedItem.getBook().getAuthor(),
                updatedItem.getBook().getPrice(),
                updatedItem.getBook().getCoverImage(),
                updatedItem.getQuantity(),
                updatedItem.getCreatedAt(),
                updatedItem.getUpdatedAt()
        );
        
        return ApiResponse.success("Cart item updated", response);
    }
    
    @DeleteMapping("/remove/{cartItemId}")
    @Operation(summary = "Remove item from cart")
    @Transactional
    public ApiResponse<Void> removeFromCart(@PathVariable Long cartItemId) {
        User user = getCurrentUser();
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to cart item");
        }
        
        cartItemRepository.softDeleteById(cartItemId);
        
        return ApiResponse.success("Item removed from cart", null);
    }
    
    @DeleteMapping("/clear")
    @Operation(summary = "Clear all cart items")
    @Transactional
    public ApiResponse<Void> clearCart() {
        User user = getCurrentUser();
        cartItemRepository.softDeleteByUser(user);
        
        return ApiResponse.success("Cart cleared", null);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
