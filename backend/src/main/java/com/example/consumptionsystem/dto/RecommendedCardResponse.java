package com.example.consumptionsystem.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class RecommendedCardResponse {
    private Long cardId;
    private String cardName;
    private String company;
    private String imageUrl;
    private BigDecimal maxBenefitValue;
    private String recommendedCategory;
    private Double recommendationScore;
}
