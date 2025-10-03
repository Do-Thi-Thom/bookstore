package com.riki.bookstore.service;

import com.riki.bookstore.dto.ProfileResponse;
import com.riki.bookstore.dto.ProfileUpdateRequest;
import com.riki.bookstore.entity.User;
import com.riki.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ProfileService {
    
    private final UserRepository userRepository;
    
    public ProfileResponse getCurrentUserProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return mapToProfileResponse(user);
    }
    
    public ProfileResponse updateProfile(ProfileUpdateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if email already exists (excluding current user)
        if (userRepository.existsByEmailAndIdNot(request.getEmail(), user.getId())) {
            throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác");
        }
        
        // Update user information
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        
        User updatedUser = userRepository.save(user);
        
        return mapToProfileResponse(updatedUser);
    }
    
    private ProfileResponse mapToProfileResponse(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setRole(user.getRole().name());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        
        // Format member since date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        response.setMemberSince(user.getCreatedAt().format(formatter));
        
        // Default profile image (can be enhanced later)
        response.setProfileImage(null);
        
        return response;
    }
}

