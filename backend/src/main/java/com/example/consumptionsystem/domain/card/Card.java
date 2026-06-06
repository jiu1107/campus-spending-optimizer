package com.example.consumptionsystem.domain.card;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "card_name", nullable = false)
    private String cardName;

    @Column(nullable = false, length = 50)
    private String company;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "base_benefit_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal baseBenefitRate = BigDecimal.ZERO;
}
