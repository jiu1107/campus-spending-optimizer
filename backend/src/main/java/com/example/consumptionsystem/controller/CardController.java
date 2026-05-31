package com.example.consumptionsystem.controller;

import com.example.consumptionsystem.dto.CardResponseDto;
import com.example.consumptionsystem.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    // 전체 카드 목록 조회
    @GetMapping
    public ResponseEntity<List<CardResponseDto>> getAllCards() {
        return ResponseEntity.ok(cardService.getAllCards());
    }

    // 유저 등록 카드 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardResponseDto>> getUserCards(@PathVariable Long userId) {
        return ResponseEntity.ok(cardService.getUserCards(userId));
    }

    // 유저 카드 등록
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> registerUserCard(@PathVariable Long userId, @RequestBody Map<String, Long> body) {
        cardService.registerUserCard(userId, body.get("cardId"));
        return ResponseEntity.ok().build();
    }

    // 유저 카드 삭제
    @DeleteMapping("/user/{userId}/{cardId}")
    public ResponseEntity<?> deleteUserCard(@PathVariable Long userId, @PathVariable Long cardId) {
        cardService.deleteUserCard(userId, cardId);
        return ResponseEntity.ok().build();
    }
}
