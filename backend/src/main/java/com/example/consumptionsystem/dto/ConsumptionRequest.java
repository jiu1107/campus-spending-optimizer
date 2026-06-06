package com.example.consumptionsystem.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ConsumptionRequest {
    private Integer amount;
    private String category;
    private String storeName;
    private Double latitude;
    private Double longitude;
    private LocalDateTime consumedAt;
    private String cardName;
}
