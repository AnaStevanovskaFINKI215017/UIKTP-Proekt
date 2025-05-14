package com.uiktp.service.Implementation;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfWriter;
import com.uiktp.model.*;
import com.uiktp.model.dtos.FlashCardDTO;
import com.uiktp.model.dtos.FlashCardResponseDTO;
import com.uiktp.model.exceptions.custom.FlashCardGenerationException;
import com.uiktp.model.exceptions.general.InvalidArgumentsException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.FlashCardRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.FlashCardService;
import com.uiktp.service.Interface.UserCourseAttachmentService;
import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Hibernate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.awt.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlashCardServiceImpl implements FlashCardService {

    private final FlashCardRepository flashCardRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final UserCourseAttachmentService userCourseAttachmentService;

    public FlashCardServiceImpl(FlashCardRepository flashCardRepository, CourseRepository courseRepository, UserRepository userRepository, UserCourseAttachmentService userCourseAttachmentService) {
        this.flashCardRepository = flashCardRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.userCourseAttachmentService = userCourseAttachmentService;
    }

    @Override
    public List<FlashCard> getAllFlashCards() {
        return flashCardRepository.findAll();
    }

    @Override
    public List<FlashCardDTO> getAllFlashCardsByCourseId(Long courseId) {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null.");
        }
        try {
            List<FlashCard> flashCards = userCourseAttachmentService.getAttachmentsByCourse(courseId)
                    .stream()
                    .flatMap(attachment -> flashCardRepository.findAllByAttachment(attachment).stream())
                    .toList();


            if (flashCards.isEmpty()) {
                throw new NoSuchElementException("No flashcards found for course ID: " + courseId);
            }

            return flashCards.stream()
                    .map(flashCard -> new FlashCardDTO(
                            flashCard.getId(),
                            flashCard.getQuestion(),
                            flashCard.getAnswer(),
                            flashCard.getAttachment().getCourse().getId(),
                            flashCard.getAttachment().getCourse().getTitle()))
                    .collect(Collectors.toList());
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while fetching flashcards for course ID: " + courseId, e);
        } catch (PersistenceException e) {
            throw new RuntimeException("Persistence error while fetching flashcards for course ID: " + courseId, e);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching flashcards for course ID: " + courseId, e);
        }
    }

    @Override
    public List<FlashCardDTO> getAllFlashCardsByAttachmentId(UUID attachmentId) {
        if (attachmentId == null) {
            throw new IllegalArgumentException("Attachment ID cannot be null.");
        }

        try {
            UserCourseAttachment attachment = userCourseAttachmentService.getById(attachmentId);
            List<FlashCard> flashCards = flashCardRepository.findAllByAttachment(attachment);

            if (flashCards.isEmpty()) {
                throw new NoSuchElementException("No flashcards found for attachment ID: " + attachmentId);
            }

            return flashCards.stream()
                    .map(flashCard -> new FlashCardDTO(
                            flashCard.getId(),
                            flashCard.getQuestion(),
                            flashCard.getAnswer(),
                            flashCard.getAttachment().getCourse().getId(),
                            flashCard.getAttachment().getCourse().getTitle()))
                    .collect(Collectors.toList());

        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while fetching flashcards for attachment ID: " + attachmentId, e);
        } catch (PersistenceException e) {
            throw new RuntimeException("Persistence error while fetching flashcards for attachment ID: " + attachmentId, e);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching flashcards for attachment ID: " + attachmentId, e);
        }
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

    @Override
    public List<FlashCard> generateFlashCard(UUID attachmentId, int numFlashcards) throws FileNotFoundException {
        UserCourseAttachment attachment = userCourseAttachmentService.getById(attachmentId);

        File file = new File(attachment.getFileUrl());
        if (!file.exists()) {
            throw new FileNotFoundException("File not found at path: " + attachment.getFileUrl());
        }

        byte[] fileBytes;
        try {
            Path path = file.toPath();
            fileBytes = Files.readAllBytes(path);
        } catch (IOException e) {
            throw new RuntimeException("Error reading file bytes", e);
        }

        if (numFlashcards < 1 || numFlashcards > 5) {
            throw new InvalidArgumentsException("A maximum of 5 flashcards can be generated!");
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            ByteArrayResource PDFasResource = new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return file.getName();
                }
            };

            body.add("file", PDFasResource);
            body.add("num_flashcards", numFlashcards);

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<FlashCardResponseDTO> response = restTemplate.postForEntity("http://localhost:8000/", entity,
                    FlashCardResponseDTO.class);

            List<Map<String, String>> pairs = Objects.requireNonNull(response.getBody()).getQuestion_answer_pairs();
            List<FlashCard> flashCards = new ArrayList<>();

            for (Map<String, String> pair : pairs) {
                FlashCard flashCard = getFlashCard(pair, attachment);
                flashCards.add(flashCard);
            }
            return flashCardRepository.saveAll(flashCards);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new FlashCardGenerationException(attachment.getOriginalFileName());
        }
    }

    private FlashCard getFlashCard(Map<String, String> pair, UserCourseAttachment attachment) {
        String question = "";
        String answer = "";

        for (Map.Entry<String, String> entry : pair.entrySet()) {
            if (entry.getKey().toLowerCase().contains("question")) {
                question = entry.getValue();
            } else if (entry.getKey().toLowerCase().contains("answer")) {
                answer = entry.getValue();
            }
        }

        FlashCard flashCard = new FlashCard();
        flashCard.setQuestion(question);
        flashCard.setAnswer(answer);
        flashCard.setAttachment(attachment);
        return flashCard;
    }

    @Override
    @Transactional(readOnly = true)
    public void exportFlashCardsToPdf(Long courseId, HttpServletResponse response)
            throws DocumentException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser;

        if (authentication.getPrincipal() instanceof User) {
            currentUser = (User) authentication.getPrincipal();
        } else {
            String currentUserEmail = authentication.getName();
            currentUser = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new InvalidArgumentsException(String.format("Course with id: %d not found", courseId)));

        Hibernate.initialize(course.getLikedBy());

        List<FlashCard> allUserCourseFlashcards = userCourseAttachmentService.getAttachmentsByCourseAndUser(courseId, currentUser.getId())
                .stream()
                .flatMap(attachment -> flashCardRepository.findAllByAttachment(attachment).stream())
                .toList();

        if (allUserCourseFlashcards.isEmpty()) {
            throw new InvalidArgumentsException("No flashcards found for this course");
        }

        Map<String, List<FlashCard>> flashcardBatches = new HashMap<>();
        for (FlashCard card : allUserCourseFlashcards) {
            byte[] attachmentBytes = Files.readAllBytes(Path.of(card.getAttachment().getFileUrl()));

            String attachmentHash = card.getAttachment() != null ?
                    String.valueOf(Arrays.hashCode(attachmentBytes)) :
                    "no-attachment";

            if (!flashcardBatches.containsKey(attachmentHash)) {
                flashcardBatches.put(attachmentHash, new ArrayList<>());
            }
            flashcardBatches.get(attachmentHash).add(card);
        }

        List<FlashCard> mostRecentBatch = Collections.emptyList();

        for (FlashCard card : allUserCourseFlashcards.stream()
                .sorted(Comparator.comparing(FlashCard::getId).reversed())
                .toList()) {

            String hash = "no-attachment";
            if (card.getAttachment() != null) {
                try {
                    byte[] attachmentBytes = Files.readAllBytes(Path.of(card.getAttachment().getFileUrl()));
                    hash = String.valueOf(Arrays.hashCode(attachmentBytes));
                } catch (IOException e) {
                    // Log or handle more gracefully
                    continue;
                }
            }

            if (flashcardBatches.containsKey(hash)) {
                mostRecentBatch = flashcardBatches.get(hash);
                break;
            }
        }

        if (mostRecentBatch.isEmpty()) {
            throw new InvalidArgumentsException("No flashcards found for this course");
        }

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(18);
        titleFont.setColor(Color.BLUE);

        Paragraph title = new Paragraph("Flashcards for " + course.getTitle(), titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        Font dateFont = FontFactory.getFont(FontFactory.HELVETICA);
        dateFont.setSize(12);

        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        Paragraph date = new Paragraph("Generated on: " + formatter.format(new Date()), dateFont);
        date.setAlignment(Paragraph.ALIGN_RIGHT);
        document.add(date);

        document.add(new Paragraph("\n"));

        for (int i = 0; i < mostRecentBatch.size(); i++) {
            FlashCard flashCard = mostRecentBatch.get(i);

            Font cardFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            cardFont.setSize(14);

            Paragraph cardNumber = new Paragraph("Flashcard #" + (i + 1), cardFont);
            document.add(cardNumber);

            Font questionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            questionFont.setSize(12);

            Paragraph question = new Paragraph("Question: ", questionFont);
            question.add(new Chunk(flashCard.getQuestion(), FontFactory.getFont(FontFactory.HELVETICA)));
            document.add(question);

            Font answerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            answerFont.setSize(12);

            Paragraph answer = new Paragraph("Answer: ", answerFont);
            answer.add(new Chunk(flashCard.getAnswer(), FontFactory.getFont(FontFactory.HELVETICA)));
            document.add(answer);

            document.add(new Paragraph("\n"));
        }

        document.close();
    }
}
