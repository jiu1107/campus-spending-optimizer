package com.example.consumptionsystem.domain.card;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "card_benefits")
@Getter
@Setter
@NoArgsConstructor
public class CardBenefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "benefit_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private BenefitType benefitType;

    @Column(name = "benefit_value", nullable = false, precision = 5, scale = 2)
    private BigDecimal benefitValue;

    @Column(name = "requirement_min", nullable = false)
    private Integer requirementMin = 0;

    public enum BenefitType {
        DISCOUNT, POINT
    }
}
