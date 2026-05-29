package com.example.consumptionsystem.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategorySummaryResponse {
    private String category;
    private Long totalAmount;

    public CategorySummaryResponse(String category, Long totalAmount) {
        this.category = category;
        this.totalAmount = totalAmount;
    }
}
