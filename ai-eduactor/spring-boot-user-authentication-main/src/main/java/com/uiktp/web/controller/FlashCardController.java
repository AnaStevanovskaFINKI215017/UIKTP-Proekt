package com.uiktp.web.controller;

import com.lowagie.text.DocumentException;
import com.uiktp.model.FlashCard;
import com.uiktp.model.dtos.FlashCardDTO;
import com.uiktp.service.Interface.FlashCardService;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "http://localhost:3000")
public class FlashCardController {

    private final FlashCardService flashCardService;

    public FlashCardController(FlashCardService flashCardService) {
        this.flashCardService = flashCardService;
    }

    @GetMapping
    public List<FlashCard> getAllFlashCards() {
        return flashCardService.getAllFlashCards();
    }

    @GetMapping("/game/{courseId}")
    public List<FlashCardDTO> getAllFlashCardsByCourseId(@PathVariable Long courseId) {
        return flashCardService.getAllFlashCardsByCourseId(courseId);
    }
//    @GetMapping("/attachment/game/{id}")
//    public List<FlashCardDTO> getAllFlashCardsByAttachmentId(@PathVariable Long id) {
//        return flashCardService.getAllFlashCardsByCourseId(id);
//    }

    @PostMapping
    public FlashCard createFlashCard(@RequestBody FlashCard flashCard) {
        return flashCardService.addFlashCard(flashCard);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlashCard> updateFlashCard(@PathVariable Long id, @RequestBody FlashCard flashCard) {
        return ResponseEntity.ok(flashCardService.updateFlashCard(id, flashCard));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFlashCard(@PathVariable Long id) {
        try {
            flashCardService.deleteFlashCard(id);
            String message = "Flashcard with ID " + id + " has been successfully deleted.";
            return ResponseEntity.status(HttpStatus.OK).body(message);
        } catch (NoSuchElementException e) {
            String errorMessage = "Flashcard with ID " + id + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        } catch (Exception e) {
            String errorMessage = "An error occurred while deleting the flashcard.";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<List<FlashCard>> generateFlashCard(
            @RequestParam("attachment_id") UUID attachmentId,
            @RequestParam("num_flashcards") int numFlashcards) throws FileNotFoundException {
        return ResponseEntity.ok(flashCardService.generateFlashCard(attachmentId, numFlashcards));
    }

    @GetMapping("/export/{courseId}")
    public void exportFlashCardsToPdf(@PathVariable Long courseId, HttpServletResponse response)
            throws DocumentException, IOException {
        response.setContentType("application/pdf");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=flashcards.pdf");

        flashCardService.exportFlashCardsToPdf(courseId, response);
    }
}
