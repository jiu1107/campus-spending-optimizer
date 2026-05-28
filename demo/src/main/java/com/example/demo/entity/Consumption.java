package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "consumptions") // DB에 만들어질 가계부 테이블 이름
public class Consumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 누가 쓴 돈인지 알아야 하니까 유저 테이블과 연결!
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer amount; // 결제 금액

    @Column(nullable = false)
    private String category; // 카테고리 (식비, 교통비, 쇼핑 등)

    private String storeName; // 가게 이름

    @Column(nullable = false)
    private LocalDateTime consumptionDate; // 결제한 날짜와 시간
}