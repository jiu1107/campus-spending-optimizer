package com.example.consumptionsystem.domain.card;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardBenefitRepository extends JpaRepository<CardBenefit, Long> {
    List<CardBenefit> findByCard(Card card);
}
