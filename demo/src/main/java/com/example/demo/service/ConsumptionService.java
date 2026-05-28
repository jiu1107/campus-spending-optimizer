package com.example.demo.service;

import com.example.demo.entity.Consumption;
import com.example.demo.entity.User;
import com.example.demo.repository.ConsumptionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ConsumptionService {

    private final ConsumptionRepository consumptionRepository;
    private final UserRepository userRepository;

    public ConsumptionService(ConsumptionRepository consumptionRepository, UserRepository userRepository) {
        this.consumptionRepository = consumptionRepository;
        this.userRepository = userRepository;
    }

    // 📝 1. 소비 내역 저장 (Create)
    public String addConsumption(String email, Map<String, Object> data) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Consumption consumption = new Consumption();
        consumption.setUser(user);
        consumption.setAmount(Integer.parseInt(String.valueOf(data.get("amount"))));
        consumption.setCategory((String) data.get("category"));
        consumption.setStoreName((String) data.get("storeName"));
        consumption.setConsumptionDate(LocalDateTime.now()); // 현재 시간 자동 저장

        consumptionRepository.save(consumption);
        return "소비 내역 저장 완료!";
    }

    // 📖 2. 내 소비 내역 조회 (Read)
    public List<Consumption> getUserConsumptions(String email) {
        return consumptionRepository.findByUserEmail(email);
    }

    // 🗑️ 3. 소비 내역 삭제 (Delete)
    public String deleteConsumption(Long id) {
        consumptionRepository.deleteById(id);
        return "삭제 완료!";
    }

    // 📊 4. 총 소비 금액 집계 API (윤우님 할당량 완료!)
    public int getTotalConsumption(String email) {
        List<Consumption> list = consumptionRepository.findByUserEmail(email);
        int total = 0;
        for (Consumption c : list) {
            total += c.getAmount();
        }
        return total;
    }
}