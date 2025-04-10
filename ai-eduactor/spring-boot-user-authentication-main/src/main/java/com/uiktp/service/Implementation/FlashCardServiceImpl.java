package com.uiktp.service.Implementation;

import com.uiktp.model.FlashCard;
import com.uiktp.repository.FlashCardRepository;
import com.uiktp.service.Interface.FlashCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlashCardServiceImpl implements FlashCardService {

    private final FlashCardRepository flashCardRepository;

    public FlashCardServiceImpl(FlashCardRepository flashCardRepository) {
        this.flashCardRepository = flashCardRepository;
    }

    @Override
    public List<FlashCard> getAllFlashCards() {
        return flashCardRepository.findAll();
    }

    @Override
    public Optional<FlashCard> getFlashCardById(Long id) {
        return flashCardRepository.findById(id);
    }

    @Override
    public FlashCard addFlashCard(FlashCard flashCard) {
        return flashCardRepository.save(flashCard);
    }

    @Override
    public FlashCard updateFlashCard(Long id, FlashCard flashCard) {
        Optional<FlashCard> existingFlashCard = flashCardRepository.findById(id);
        if (existingFlashCard.isPresent()) {
            FlashCard flashCardToUpdate = existingFlashCard.get();
            flashCardToUpdate.setQuestion(flashCard.getQuestion());
            flashCardToUpdate.setAnswer(flashCard.getAnswer());
            return flashCardRepository.save(flashCardToUpdate);
        }
        return null;
    }

    @Override
    public void deleteFlashCard(Long id) {
        flashCardRepository.deleteById(id);
    }
}
