package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. 모바일 앱(토큰) 방식이므로 웹 해킹 방지용(CSRF) 기능 끄기
                .csrf(AbstractHttpConfigurer::disable)

                // 2. 서버 메모리에 로그인 상태(세션) 저장 안 함 (★ JWT 쓸 때 필수 ★)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. 출입 통제 구역 설정
                .authorizeHttpRequests(auth -> auth
                        // 로그인, 회원가입 관련 주소는 팔찌(JWT) 없이도 프리패스!
                        .requestMatchers("/login", "/signup", "/error").permitAll()
                        // 그 외의 모든 데이터 요청은 무조건 팔찌 검사를 받아라!
                        .anyRequest().authenticated()
                )

                // 4. 원래 하던 아이디/비번 검사 전에 우리가 만든 '팔찌 검문소(JwtFilter)'를 먼저 거치게 순서 배치
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}