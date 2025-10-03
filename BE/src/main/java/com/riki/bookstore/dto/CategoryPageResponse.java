package com.riki.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryPageResponse {
    private List<CategoryResponse> items;
    private int pageIndex;
    private int pageSize;
    private long totalItems;
    private int totalPages;

    private long emptyCategory;
    private long notEmptyCategory;
}


