package com.riki.bookstore.dto;

import com.riki.bookstore.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    private String token;
    private String username;
    private String fullName;
    private String email;
    private String role;
    
    public static LoginResponse fromUser(User user, String token) {
        return new LoginResponse(
            token,
            user.getUsername(),
            user.getFullName(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}
