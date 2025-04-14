package com.uiktp.repository;

import com.uiktp.model.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
}
