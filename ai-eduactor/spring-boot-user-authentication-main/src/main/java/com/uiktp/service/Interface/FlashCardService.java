package com.uiktp.service.Interface;

import com.lowagie.text.DocumentException;
import com.uiktp.model.FlashCard;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.uiktp.model.dtos.FlashCardDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.transaction.annotation.Transactional;

public interface FlashCardService {
    List<FlashCard> getAllFlashCards();
    List<FlashCardDTO> getAllFlashCardsByCourseId(Long courseId);

    List<FlashCardDTO> getAllFlashCardsByAttachmentId(UUID attachmentId);

    Optional<FlashCard> getFlashCardById(Long id);

    FlashCard addFlashCard(FlashCard flashCard);

    FlashCard updateFlashCard(Long id, FlashCard flashCard);

    void deleteFlashCard(Long id);

    List<FlashCard> generateFlashCard(UUID attachmentId, int numFlashcards) throws FileNotFoundException;

    @Transactional(readOnly = true)
    void exportFlashCardsToPdf(Long courseId, HttpServletResponse response)
            throws DocumentException, IOException;
}
