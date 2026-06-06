package com.example.consumptionsystem.controller;

import com.example.consumptionsystem.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Integer>> getBudgets(
            @PathVariable Long userId,
            @RequestParam Integer year,
            @RequestParam Integer month) {
        return ResponseEntity.ok(budgetService.getBudgets(userId, year, month));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> setBudget(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> body) {
        Integer year = (Integer) body.get("year");
        Integer month = (Integer) body.get("month");
        String category = (String) body.get("category");
        Integer amount = (Integer) body.get("amount");
        budgetService.setBudget(userId, year, month, category, amount);
        return ResponseEntity.ok().build();
    }
}
