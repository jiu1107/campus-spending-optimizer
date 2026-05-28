package com.example.demo.controller;

import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    // 공장(JwtUtil)과 주방장(UserService)을 매표소로 데려오기
    public AuthController(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    // 📝 회원가입 API (앱에서 "/signup"으로 정보를 보내면 여기가 실행됨)
    @PostMapping("/signup")
    public String signup(@RequestBody Map<String, String> signupData) {
        // 점원은 주문만 받아서 주방장(UserService)에게 토스!
        return userService.registerUser(signupData);
    }

    // 🔑 로그인 API (이제 진짜 DB랑 연결할 준비 완료)
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // 지금은 가짜 테스트용. 다음엔 DB를 뒤져서 비밀번호가 맞는지 확인하는 코드로 바꿀 겁니다.
        if ("test@test.com".equals(email) && "1234".equals(password)) {
            return jwtUtil.generateToken(email);
        } else {
            return "로그인 실패: 이메일이나 비밀번호가 틀렸습니다.";
        }
    }
}