package com.riki.bookstore.service;

import com.riki.bookstore.dto.LoginRequest;
import com.riki.bookstore.dto.LoginResponse;
import com.riki.bookstore.dto.RegisterRequest;
import com.riki.bookstore.entity.User;
import com.riki.bookstore.repository.UserRepository;
import com.riki.bookstore.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public LoginResponse register(RegisterRequest request, User.Role role) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(role);
        user.setEnabled(true);
        
        userRepository.save(user);
        
        String token = jwtService.generateToken(user);
        
        return LoginResponse.fromUser(user, token);
    }
    
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }
        
        String token = jwtService.generateToken(user);
        
        return LoginResponse.fromUser(user, token);
    }
}
