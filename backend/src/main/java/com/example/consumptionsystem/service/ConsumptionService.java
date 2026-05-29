package com.example.consumptionsystem.service;

import com.example.consumptionsystem.domain.consumption.Consumption;
import com.example.consumptionsystem.domain.consumption.ConsumptionRepository;
import com.example.consumptionsystem.domain.user.User;
import com.example.consumptionsystem.domain.user.UserRepository;
import com.example.consumptionsystem.dto.ConsumptionRequest;
import com.example.consumptionsystem.dto.CategorySummaryResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsumptionService {

    private final ConsumptionRepository consumptionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Consumption addConsumption(Long userId, ConsumptionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Consumption consumption = new Consumption();
        consumption.setUser(user);
        consumption.setAmount(request.getAmount());
        consumption.setCategory(Consumption.Category.valueOf(request.getCategory().toUpperCase()));
        consumption.setStoreName(request.getStoreName());
        consumption.setLatitude(request.getLatitude());
        consumption.setLongitude(request.getLongitude());
        consumption.setConsumedAt(request.getConsumedAt());

        return consumptionRepository.save(consumption);
    }

    public List<Consumption> getConsumptionsByUserAndPeriod(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return consumptionRepository.findByUserAndConsumedAtBetweenOrderByConsumedAtDesc(user, startDate, endDate);
    }

    public List<CategorySummaryResponse> getCategorySummary(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Object[]> results = consumptionRepository.findCategorySummaryByUserAndPeriod(user, startDate, endDate);

        return results.stream()
                .map(result -> new CategorySummaryResponse(
                        ((Consumption.Category) result[0]).name(),
                        (Long) result[1]
                ))
                .collect(Collectors.toList());
    }

    // DTOs for request and response
    // These would typically be in a separate 'dto' package
    // For simplicity, defining them here temporarily
    public static class ConsumptionRequest {
        private Integer amount;
        private String category;
        private String storeName;
        private Double latitude;
        private Double longitude;
        private LocalDateTime consumedAt;

        public Integer getAmount() { return amount; }
        public void setAmount(Integer amount) { this.amount = amount; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getStoreName() { return storeName; }
        public void setStoreName(String storeName) { this.storeName = storeName; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public LocalDateTime getConsumedAt() { return consumedAt; }
        public void setConsumedAt(LocalDateTime consumedAt) { this.consumedAt = consumedAt; }
    }

    public static class CategorySummaryResponse {
        private String category;
        private Long totalAmount;

        public CategorySummaryResponse(String category, Long totalAmount) {
            this.category = category;
            this.totalAmount = totalAmount;
        }

        public String getCategory() { return category; }
        public Long getTotalAmount() { return totalAmount; }
    }
}
