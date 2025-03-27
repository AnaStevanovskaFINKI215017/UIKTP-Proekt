package com.uiktp.services.Interface;

import com.uiktp.entities.users.FlashCard;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface FlashCardServiceI {
    List<FlashCard> getAllFlashCards();
    Optional<FlashCard> getFlashCardById(Long id);
    FlashCard addFlashCard(FlashCard flashCard);
    FlashCard updateFlashCard(Long id, FlashCard flashCard);
    void deleteFlashCard(Long id);
}
