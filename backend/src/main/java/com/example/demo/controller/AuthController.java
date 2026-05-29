package com.example.demo.controller;

import com.example.demo.util.JwtUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    private final JwtUtil jwtUtil;

    // 아까 만든 팔찌 공장(JwtUtil)을 매표소로 가져오기
    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // 클라이언트(앱)가 아이디/비번을 들고 '/login' 주소로 찾아오면 실행됨
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // 🚨 임시 테스트용 조건문 (나중에는 진짜 DB에 있는 유저인지 확인하도록 바꿀 겁니다!)
        if ("test@test.com".equals(email) && "1234".equals(password)) {
            // 아이디 비번이 맞으면 공장 가동해서 토큰(팔찌) 발급!
            return jwtUtil.generateToken(email);
        } else {
            return "로그인 실패: 이메일이나 비밀번호가 틀렸습니다.";
        }
    }
}