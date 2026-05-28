package com.example.demo.repository;

import com.example.demo.entity.Consumption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsumptionRepository extends JpaRepository<Consumption, Long> {
    // 🔍 접속한 유저의 이메일을 주면, 그 유저가 긁은 결제 내역만 싹 다 찾아오는 쿼리
    List<Consumption> findByUserEmail(String email);
}