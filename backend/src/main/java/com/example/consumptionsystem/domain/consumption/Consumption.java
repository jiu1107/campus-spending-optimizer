package com.example.consumptionsystem.domain.consumption;

import com.example.consumptionsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "consumptions")
@Getter
@Setter
@NoArgsConstructor
public class Consumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(name = "store_name")
    private String storeName;

    private Double latitude;

    private Double longitude;

    @Column(name = "consumed_at", nullable = false)
    private LocalDateTime consumedAt;

    @Column(name = "card_name")
    private String cardName;

    public enum Category {
        FOOD, CAFE, TRANSPORT, SHOPPING, ENTERTAINMENT, EDUCATION, HEALTH, CONVENIENCE_STORE, CULTURE, ETC
    }
}
