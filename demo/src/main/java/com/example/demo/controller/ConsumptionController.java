package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consumptions")
public class ConsumptionController {

    @PostMapping
    public String create() { return "소비 내역 생성 API"; }

    @GetMapping("/{id}")
    public String get() { return "소비 내역 조회 API"; }

    @PutMapping("/{id}")
    public String update() { return "소비 내역 수정 API"; }

    @DeleteMapping("/{id}")
    public String delete() { return "소비 내역 삭제 API"; }

    @GetMapping("/summary/category")
    public String getSummary() { return "카테고리별 집계 API"; }
}