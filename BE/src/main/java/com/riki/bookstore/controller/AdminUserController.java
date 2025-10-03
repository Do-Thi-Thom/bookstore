package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.PageResponse;
import com.riki.bookstore.dto.UserResponse;
import com.riki.bookstore.dto.AdminUserPageResponse;
import com.riki.bookstore.entity.User;
import com.riki.bookstore.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin User Management", description = "Admin user management APIs")
public class AdminUserController {
    
    private final UserRepository userRepository;
    
    @GetMapping
    @Operation(summary = "Get all users with pagination and statistics")
    public ApiResponse<AdminUserPageResponse> getAllUsers(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<User> page = userRepository.findAll(pageable);
        
        List<UserResponse> userResponses = page.getContent().stream()
                .map(UserResponse::fromUser)
                .toList();
        
        // Calculate statistics
        long activeAccounts = userRepository.countByEnabledTrue();
        long adminCount = userRepository.countByRole(User.Role.ADMIN);
        long customerCount = userRepository.countByRole(User.Role.USER);
        
        AdminUserPageResponse payload = new AdminUserPageResponse(
                userResponses,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                activeAccounts,
                adminCount,
                customerCount
        );
        
        return ApiResponse.success(payload);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ApiResponse.success(UserResponse.fromUser(user));
    }
    
    @PutMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle user enabled status")
    public ApiResponse<UserResponse> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEnabled(!user.isEnabled());
        User updatedUser = userRepository.save(user);
        
        String message = user.isEnabled() ? "User enabled successfully" : "User disabled successfully";
        
        return ApiResponse.success(message, UserResponse.fromUser(updatedUser));
    }
    
    @GetMapping("/customers")
    @Operation(summary = "Get all customers (users with USER role)")
    public ApiResponse<PageResponse<UserResponse>> getAllCustomers(
            @RequestParam(name = "pageIndex", defaultValue = "0") int pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<User> page = userRepository.findByRole(User.Role.USER, pageable);
        
        List<UserResponse> userResponses = page.getContent().stream()
                .map(UserResponse::fromUser)
                .toList();
        
        PageResponse<UserResponse> payload = new PageResponse<>(
                userResponses,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
        
        return ApiResponse.success(payload);
    }
}
