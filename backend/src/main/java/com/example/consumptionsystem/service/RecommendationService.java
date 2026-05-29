package com.example.consumptionsystem.service;

import com.example.consumptionsystem.domain.card.Card;
import com.example.consumptionsystem.domain.card.CardBenefit;
import com.example.consumptionsystem.domain.card.CardBenefitRepository;
import com.example.consumptionsystem.domain.card.CardRepository;
import com.example.consumptionsystem.domain.consumption.Consumption;
import com.example.consumptionsystem.domain.consumption.ConsumptionRepository;
import com.example.consumptionsystem.domain.user.User;
import com.example.consumptionsystem.domain.user.UserRepository;
import com.example.consumptionsystem.dto.RecommendedCardResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserRepository userRepository;
    private final ConsumptionRepository consumptionRepository;
    private final CardRepository cardRepository;
    private final CardBenefitRepository cardBenefitRepository;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    // In a real application, this would be loaded from a database or external service
    // For this example, we'll load from a static JSON file or generate mock data
    private List<CardBenefitJson> cardBenefitsData = new ArrayList<>();

    @Value("${card.benefits.json.path:classpath:card_benefits.json}")
    private String cardBenefitsJsonPath;

    @PostConstruct
    public void init() {
        try {
            Resource resource = resourceLoader.getResource(cardBenefitsJsonPath);
            if (resource.exists()) {
                cardBenefitsData = objectMapper.readValue(resource.getInputStream(), new TypeReference<List<CardBenefitJson>>() {});
                System.out.println("Card benefits loaded from JSON: " + cardBenefitsData.size() + " cards");
            } else {
                System.out.println("Card benefits JSON not found. Generating mock data.");
                generateMockCardBenefits();
            }
        } catch (IOException e) {
            System.err.println("Error loading card benefits JSON: " + e.getMessage());
            generateMockCardBenefits();
        }
    }

    private void generateMockCardBenefits() {
        // Mock data generation if JSON file is not found or fails to load
        Card mockCard1 = new Card();
        mockCard1.setId(1L);
        mockCard1.setCardName("대학생 꿀카드");
        mockCard1.setCompany("신한카드");
        mockCard1.setImageUrl("http://example.com/card1.png");
        mockCard1.setBaseBenefitRate(BigDecimal.valueOf(0.01));

        Card mockCard2 = new Card();
        mockCard2.setId(2L);
        mockCard2.setCardName("청춘 체크카드");
        mockCard2.setCompany("국민카드");
        mockCard2.setImageUrl("http://example.com/card2.png");
        mockCard2.setBaseBenefitRate(BigDecimal.valueOf(0.005));

        cardBenefitsData.add(new CardBenefitJson(1L, "대학생 꿀카드", "신한카드", Arrays.asList(
                new CardBenefitJson.Benefit("CAFE", "DISCOUNT", BigDecimal.valueOf(0.10), 300000, "카페 10% 할인"),
                new CardBenefitJson.Benefit("TRANSPORT", "POINT", BigDecimal.valueOf(0.05), 0, "대중교통 5% 적립")
        )));
        cardBenefitsData.add(new CardBenefitJson(2L, "청춘 체크카드", "국민카드", Arrays.asList(
                new CardBenefitJson.Benefit("FOOD", "DISCOUNT", BigDecimal.valueOf(0.05), 200000, "음식점 5% 할인"),
                new CardBenefitJson.Benefit("SHOPPING", "POINT", BigDecimal.valueOf(0.03), 0, "온라인 쇼핑 3% 적립")
        )));
    }

    public List<RecommendedCardResponse> recommendCards(Long userId, Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 1. 사용자 선호 카테고리 추출 (최근 1개월)
        Map<Consumption.Category, Long> userCategoryConsumption = getUserCategoryConsumption(user);
        List<Consumption.Category> preferredCategories = userCategoryConsumption.entrySet().stream()
                .sorted(Map.Entry.<Consumption.Category, Long>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // 2. 주변 가맹점 카테고리 확인 (Mock)
        // 실제로는 KakaoMap API 호출하여 주변 가맹점 카테고리 파악
        List<String> nearbyStoreCategories = getMockNearbyStoreCategories(latitude, longitude);

        List<RecommendedCardResponse> recommendations = new ArrayList<>();

        for (CardBenefitJson cardJson : cardBenefitsData) {
            // Assume card exists in DB for full details
            Optional<Card> cardOpt = cardRepository.findById(cardJson.getCardId());
            if (cardOpt.isEmpty()) continue;
            Card card = cardOpt.get();

            BigDecimal maxBenefitValue = BigDecimal.ZERO;
            String recommendedCategory = "";
            double userPreferenceScore = 0.0;

            for (CardBenefitJson.Benefit benefit : cardJson.getBenefits()) {
                // Mock: Check if user meets requirement (simplified)
                // In real app, check user's actual current_performance for the card
                boolean meetsRequirement = true; // For simplicity, assume all requirements met

                if (meetsRequirement) {
                    // Match with preferred categories
                    if (preferredCategories.contains(Consumption.Category.valueOf(benefit.getCategory()))) {
                        userPreferenceScore += 10; // Score for matching preferred category
                    }
                    // Match with nearby store categories
                    if (nearbyStoreCategories.contains(benefit.getCategory())) {
                        userPreferenceScore += 5; // Score for matching nearby category
                    }

                    if (benefit.getBenefitValue().compareTo(maxBenefitValue) > 0) {
                        maxBenefitValue = benefit.getBenefitValue();
                        recommendedCategory = benefit.getCategory();
                    }
                }
            }

            // 가중치 적용 점수 계산: (사용자 선호 카테고리 매칭 점수 * 0.4) + (최대 혜택률 * 0.6)
            // 최대 혜택률은 0.0 ~ 1.0 사이 값 (예: 10% 할인 -> 0.1)
            // 사용자 선호 점수는 임의로 최대 50점 정도로 가정 (선호 3개 * 10점 + 주변 3개 * 5점)
            double recommendationScore = (userPreferenceScore / 50.0 * 0.4) + (maxBenefitValue.doubleValue() * 0.6);

            recommendations.add(RecommendedCardResponse.builder()
                    .cardId(card.getId())
                    .cardName(card.getCardName())
                    .company(card.getCompany())
                    .imageUrl(card.getImageUrl())
                    .maxBenefitValue(maxBenefitValue)
                    .recommendedCategory(recommendedCategory)
                    .recommendationScore(recommendationScore)
                    .build());
        }

        // 점수 기준으로 내림차순 정렬
        recommendations.sort(Comparator.comparing(RecommendedCardResponse::getRecommendationScore).reversed());

        return recommendations;
    }

    private Map<Consumption.Category, Long> getUserCategoryConsumption(User user) {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        List<Consumption> consumptions = consumptionRepository.findByUserAndConsumedAtBetween(user, oneMonthAgo, LocalDateTime.now());

        return consumptions.stream()
                .collect(Collectors.groupingBy(Consumption::getCategory, Collectors.summingLong(Consumption::getAmount)));
    }

    // Mock KakaoMap API call
    private List<String> getMockNearbyStoreCategories(Double latitude, Double longitude) {
        // In a real scenario, call KakaoMap API with latitude and longitude
        // and parse the response to get nearby store categories.
        // For this example, return some fixed categories based on location (mock).
        if (latitude != null && longitude != null) {
            if (latitude > 37.5 && longitude < 127.0) { // Example: near Seoul
                return Arrays.asList("CAFE", "FOOD", "SHOPPING");
            } else if (latitude < 35.0 && longitude > 128.0) { // Example: near Busan
                return Arrays.asList("TRANSPORT", "ENTERTAINMENT");
            }
        }
        return Arrays.asList("FOOD", "CAFE", "ETC"); // Default mock categories
    }

    // DTO for loading card benefits from JSON
    @Getter
    @Setter
    @NoArgsConstructor
    public static class CardBenefitJson {
        private Long cardId;
        private String cardName;
        private String company;
        private List<Benefit> benefits;

        public CardBenefitJson(Long cardId, String cardName, String company, List<Benefit> benefits) {
            this.cardId = cardId;
            this.cardName = cardName;
            this.company = company;
            this.benefits = benefits;
        }

        @Getter
        @Setter
        @NoArgsConstructor
        public static class Benefit {
            private String category;
            private String benefitType;
            private BigDecimal benefitValue;
            private Integer requirementMin;
            private String description;

            public Benefit(String category, String benefitType, BigDecimal benefitValue, Integer requirementMin, String description) {
                this.category = category;
                this.benefitType = benefitType;
                this.benefitValue = benefitValue;
                this.requirementMin = requirementMin;
                this.description = description;
            }
        }
    }
}
