package com.example.consumptionsystem.domain.card;

import com.example.consumptionsystem.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserCardRepository extends JpaRepository<UserCard, Long> {
    List<UserCard> findByUser(User user);
    Optional<UserCard> findByUserAndCard(User user, Card card);
    boolean existsByUserAndCard(User user, Card card);
}
