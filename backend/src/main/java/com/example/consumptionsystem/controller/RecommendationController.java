package com.example.consumptionsystem.controller;

import com.example.consumptionsystem.dto.RecommendationRequest;
import com.example.consumptionsystem.dto.RecommendedCardResponse;
import com.example.consumptionsystem.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    // User ID should be extracted from JWT in a real application
    // For simplicity, passing as path variable for now
    @GetMapping("/cards/{userId}")
    public ResponseEntity<List<RecommendedCardResponse>> recommendCards(
            @PathVariable Long userId,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude) {
        List<RecommendedCardResponse> recommendations = recommendationService.recommendCards(userId, latitude, longitude);
        return ResponseEntity.ok(recommendations);
    }
}
