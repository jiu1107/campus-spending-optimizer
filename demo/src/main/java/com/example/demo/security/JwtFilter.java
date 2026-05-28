package com.example.demo.security;

import com.example.demo.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // 서버에 들어오는 모든 요청은 무조건 이 메서드를 거쳐갑니다 (검문소 역할)
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. 클라이언트(플러터 앱)가 보낸 요청 헤더에서 "Authorization" 부분 꺼내기
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        // 2. 팔찌가 존재하고, "Bearer "라는 규칙으로 시작하는지 확인
        // (보통 JWT는 "Bearer 에쏼라쏼라토큰값" 형태로 보냅니다)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // "Bearer " 글자(7칸) 잘라내고 진짜 토큰만 쏙 빼기
            email = jwtUtil.extractEmail(token); // 아까 만든 공장(JwtUtil)에 토큰 주고 이메일 읽어오기
        }

        // 3. 이메일이 무사히 읽혔고, 아직 검문소를 통과한 기록이 없다면? -> 본격 검사 시작
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 공장에 다시 물어봐서 "이 토큰 진짜고 유효기간 안 지났어?" 확인
            if (jwtUtil.isTokenValid(token, email)) {

                // 4. 통과! 스프링 보안 시스템에 "이 사람 정상 로그인된 유저임" 하고 도장 찍어주기
                UserDetails userDetails = new User(email, "", new ArrayList<>());
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 서버 메모리에 통행증 저장
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 5. 검사가 끝났으니 다음 단계(또는 컨트롤러)로 요청을 넘겨줌
        filterChain.doFilter(request, response);
    }
}