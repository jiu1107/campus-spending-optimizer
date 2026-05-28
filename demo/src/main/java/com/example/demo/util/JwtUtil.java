package com.example.demo.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // 1. 비밀 키 (공장 문 잠그는 자물쇠 같은 역할, 절대 남에게 유출 금지!)
    // 주의: JJWT 최신 버전은 보안상 키 길이가 최소 32바이트(글자) 이상이어야 합니다.
    private static final String SECRET_KEY_STRING = "my-super-secret-key-for-jwt-authentication-demo-12345!";
    private final SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

    // 2. 팔찌 유효기간 (임시로 1시간 설정 = 1000ms * 60초 * 60분)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60;

    // 🎟️ 기능 1: 사용자가 로그인하면 새로운 팔찌(토큰) 발급해주기
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email) // 팔찌에 사용자 이메일 꾹 적어두기
                .issuedAt(new Date()) // 발급 시간
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 만료 시간
                .signWith(secretKey) // 우리 공장 비밀 키로 위조 방지 도장 쾅!
                .compact();
    }

    // 🔎 기능 2: 사용자가 보여준 팔찌에 적힌 이메일 읽어오기
    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey) // 우리 공장 도장이 맞는지부터 깐깐하게 확인
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // 👮 기능 3: 이 팔찌가 진짜 본인 것이고, 아직 유효기간이 안 지났는지 검사하기
    public boolean isTokenValid(String token, String userEmail) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(userEmail) && !isTokenExpired(token));
    }

    // ⏰ 기능 4: 팔찌 유효시간 지났는지 팩트 체크
    private boolean isTokenExpired(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }
}