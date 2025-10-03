package com.riki.bookstore.controller;

import com.riki.bookstore.dto.ApiResponse;
import com.riki.bookstore.dto.ProfileResponse;
import com.riki.bookstore.dto.ProfileUpdateRequest;
import com.riki.bookstore.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customer/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
@Tag(name = "Customer Profile", description = "Customer profile management APIs")
public class CustomerProfileController {
    
    private final ProfileService profileService;
    
    @GetMapping
    @Operation(summary = "Get current user profile")
    public ApiResponse<ProfileResponse> getProfile() {
        ProfileResponse profile = profileService.getCurrentUserProfile();
        
        return ApiResponse.success(profile);
    }
    
    @PutMapping
    @Operation(summary = "Update current user profile")
    public ApiResponse<ProfileResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        ProfileResponse updatedProfile = profileService.updateProfile(request);
        
        return ApiResponse.success("Cập nhật thông tin thành công", updatedProfile);
    }
}

