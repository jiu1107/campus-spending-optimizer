package com.example.consumptionsystem.service;

import com.example.consumptionsystem.domain.budget.Budget;
import com.example.consumptionsystem.domain.budget.BudgetRepository;
import com.example.consumptionsystem.domain.user.User;
import com.example.consumptionsystem.domain.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public Map<String, Integer> getBudgets(Long userId, Integer year, Integer month) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Budget> budgets = budgetRepository.findByUserAndYearAndMonth(user, year, month);
        return budgets.stream()
                .collect(Collectors.toMap(Budget::getCategory, Budget::getAmount));
    }

    @Transactional
    public void setBudget(Long userId, Integer year, Integer month, String category, Integer amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Budget budget = budgetRepository
                .findByUserAndYearAndMonthAndCategory(user, year, month, category)
                .orElse(new Budget());
        budget.setUser(user);
        budget.setYear(year);
        budget.setMonth(month);
        budget.setCategory(category);
        budget.setAmount(amount);
        budgetRepository.save(budget);
    }
}
