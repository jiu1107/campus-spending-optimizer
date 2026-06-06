package com.example.consumptionsystem.controller;

import com.example.consumptionsystem.dto.UpdateNicknameRequest;
import com.example.consumptionsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 닉네임 수정
    @PutMapping("/{userId}/nickname")
    public ResponseEntity<String> updateNickname(
            @PathVariable Long userId,
            @RequestBody UpdateNicknameRequest request) {
        try {
            userService.updateNickname(userId, request.getNickname());
            return ResponseEntity.ok("닉네임이 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}