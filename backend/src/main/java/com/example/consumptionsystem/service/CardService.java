package com.example.consumptionsystem.service;

import com.example.consumptionsystem.domain.card.*;
import com.example.consumptionsystem.domain.user.User;
import com.example.consumptionsystem.domain.user.UserRepository;
import com.example.consumptionsystem.dto.CardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final CardBenefitRepository cardBenefitRepository;
    private final UserCardRepository userCardRepository;
    private final UserRepository userRepository;

    // 전체 카드 목록 조회
    public List<CardResponseDto> getAllCards() {
        return cardRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // 유저 등록 카드 조회
    public List<CardResponseDto> getUserCards(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return userCardRepository.findByUser(user).stream()
                .map(uc -> toDto(uc.getCard()))
                .collect(Collectors.toList());
    }

    // 유저 카드 등록
    public void registerUserCard(Long userId, Long cardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));
        if (userCardRepository.existsByUserAndCard(user, card)) {
            throw new IllegalArgumentException("Already registered");
        }
        UserCard userCard = new UserCard();
        userCard.setUser(user);
        userCard.setCard(card);
        userCardRepository.save(userCard);
    }

    // 유저 카드 삭제
    public void deleteUserCard(Long userId, Long cardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));
        UserCard userCard = userCardRepository.findByUserAndCard(user, card)
                .orElseThrow(() -> new IllegalArgumentException("UserCard not found"));
        userCardRepository.delete(userCard);
    }

    private CardResponseDto toDto(Card card) {
        List<CardBenefit> benefits = cardBenefitRepository.findByCard(card);
        Map<String, Double> benefitMap = benefits.stream()
                .collect(Collectors.toMap(
                        CardBenefit::getCategory,
                        b -> b.getBenefitValue().doubleValue()
                ));
        return CardResponseDto.builder()
                .cardId(card.getId())
                .cardName(card.getCardName())
                .company(card.getCompany())
                .benefits(benefitMap)
                .build();
    }
}
