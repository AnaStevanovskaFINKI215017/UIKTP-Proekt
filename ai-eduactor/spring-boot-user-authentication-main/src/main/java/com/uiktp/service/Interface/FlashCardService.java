package com.uiktp.service.Interface;

import com.uiktp.model.FlashCard;

import java.util.List;
import java.util.Optional;

public interface FlashCardService {
    List<FlashCard> getAllFlashCards();
    Optional<FlashCard> getFlashCardById(Long id);
    FlashCard addFlashCard(FlashCard flashCard);
    FlashCard updateFlashCard(Long id, FlashCard flashCard);
    void deleteFlashCard(Long id);
}
