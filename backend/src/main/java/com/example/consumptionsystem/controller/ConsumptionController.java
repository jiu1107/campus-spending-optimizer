package com.example.consumptionsystem.controller;

import com.example.consumptionsystem.domain.consumption.Consumption;
import com.example.consumptionsystem.dto.CategorySummaryResponse;
import com.example.consumptionsystem.dto.ConsumptionRequest;
import com.example.consumptionsystem.service.ConsumptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/consumptions")
@RequiredArgsConstructor
public class ConsumptionController {

    private final ConsumptionService consumptionService;

    // User ID should be extracted from JWT in a real application
    // For simplicity, passing as path variable for now
    @PostMapping("/{userId}")
    public ResponseEntity<Consumption> addConsumption(@PathVariable Long userId, @RequestBody ConsumptionRequest request) {
        try {
            Consumption newConsumption = consumptionService.addConsumption(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newConsumption);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Consumption>> getConsumptions(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Consumption> consumptions = consumptionService.getConsumptionsByUserAndPeriod(userId, startDate, endDate);
        return ResponseEntity.ok(consumptions);
    }

    @GetMapping("/summary/category/{userId}")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<CategorySummaryResponse> summary = consumptionService.getCategorySummary(userId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }
    @DeleteMapping("/{userId}/{consumptionId}")
public ResponseEntity<?> deleteConsumption(
        @PathVariable Long userId,
        @PathVariable Long consumptionId) {
    try {
        consumptionService.deleteConsumption(userId, consumptionId);
        return ResponseEntity.ok().build();
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
}
