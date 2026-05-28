package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;

    // 아까 만든 DB 배달부(UserRepository)를 주방으로 부르기
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 진짜 회원가입 기능 (비즈니스 로직)
    public String registerUser(Map<String, String> userData) {
        String email = userData.get("email");

        // 1. 이미 가입된 이메일인지 명부(DB) 확인
        if (userRepository.findByEmail(email).isPresent()) {
            return "실패: 이미 존재하는 이메일입니다.";
        }

        // 2. 새로운 유저 객체(명부 작성지) 만들기
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(userData.get("password")); // (원래 실무에선 암호화해야 하지만 지금은 쌩으로 직진!)
        newUser.setName(userData.get("name"));

        // 3. DB에 진짜로 저장!
        userRepository.save(newUser);

        return "성공: 회원가입이 완료되었습니다!";
    }
}