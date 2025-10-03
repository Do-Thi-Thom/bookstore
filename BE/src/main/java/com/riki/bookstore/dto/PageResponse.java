package com.riki.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    
    private List<T> items;
    private int pageIndex;
    private int pageSize;
    private long totalItems;
    private int totalPages;

}
