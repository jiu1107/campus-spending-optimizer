package com.example.consumptionsystem.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.Map;

@Getter
@Builder
public class CardResponseDto {
    private Long cardId;
    private String cardName;
    private String company;
    private Map<String, Double> benefits;
}
