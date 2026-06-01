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
        consumption.setCardName(request.getCardName());

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
    @Transactional
public void deleteConsumption(Long userId, Long consumptionId) {
    Consumption consumption = consumptionRepository.findById(consumptionId)
            .orElseThrow(() -> new IllegalArgumentException("Consumption not found"));
    if (!consumption.getUser().getId().equals(userId)) {
        throw new IllegalArgumentException("Unauthorized");
    }
    consumptionRepository.delete(consumption);
}
}
