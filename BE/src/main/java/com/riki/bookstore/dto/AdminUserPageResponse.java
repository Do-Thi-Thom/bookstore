package com.riki.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserPageResponse {
    private List<UserResponse> items;
    private int pageIndex;
    private int pageSize;
    private long totalItems;
    private int totalPages;
    
    // Statistics fields
    private long activeAccounts;
    private long adminCount;
    private long customerCount;
}
