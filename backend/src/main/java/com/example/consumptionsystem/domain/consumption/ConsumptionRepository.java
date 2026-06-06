package com.example.consumptionsystem.domain.consumption;

import com.example.consumptionsystem.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ConsumptionRepository extends JpaRepository<Consumption, Long> {
    List<Consumption> findByUserAndConsumedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT c.category, SUM(c.amount) FROM Consumption c WHERE c.user = :user AND c.consumedAt BETWEEN :startDate AND :endDate GROUP BY c.category ORDER BY SUM(c.amount) DESC")
    List<Object[]> findCategorySummaryByUserAndPeriod(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    List<Consumption> findByUserAndConsumedAtBetweenOrderByConsumedAtDesc(User user, LocalDateTime startDate, LocalDateTime endDate);
}
