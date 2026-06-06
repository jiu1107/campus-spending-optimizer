package com.example.consumptionsystem.domain.budget;

import com.example.consumptionsystem.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndYearAndMonth(User user, Integer year, Integer month);
    Optional<Budget> findByUserAndYearAndMonthAndCategory(User user, Integer year, Integer month, String category);
}
