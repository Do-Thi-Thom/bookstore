package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.LoginRequest;
import com.riki.bookstore.dto.LoginResponse;
import com.riki.bookstore.dto.RegisterRequest;
import com.riki.bookstore.entity.User;
import com.riki.bookstore.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication APIs")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    @Operation(summary = "Register new user (Customer site)")
    public ApiResponse<LoginResponse> registerCustomer(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request, User.Role.USER);
        
        return ApiResponse.success("User registered successfully", response);
    }
    
    @PostMapping("/register/admin")
    @Operation(summary = "Register new admin (Admin site)")
    public ApiResponse<LoginResponse> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request, User.Role.ADMIN);
        
        return ApiResponse.success("Admin registered successfully", response);
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        
        return ApiResponse.success("Login successful", response);
    }
}
