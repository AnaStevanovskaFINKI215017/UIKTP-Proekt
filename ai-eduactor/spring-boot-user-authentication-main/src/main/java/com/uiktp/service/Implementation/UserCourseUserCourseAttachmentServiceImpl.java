package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.User;
import com.uiktp.model.UserCourseAttachment;
import com.uiktp.model.dtos.AskQuestionRequestDTO;
import com.uiktp.model.dtos.AskQuestionResponseDTO;
import com.uiktp.model.dtos.AttachmentIDResponseDTO;
import com.uiktp.model.dtos.UserCourseAttachmentRequestDTO;
import com.uiktp.model.exceptions.custom.AskQuestionException;
import com.uiktp.model.exceptions.custom.FileUploadFailureException;
import com.uiktp.model.exceptions.custom.PDFLoadingException;
import com.uiktp.model.exceptions.general.InvalidArgumentsException;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.UserCourseAttachmentRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.UserCourseAttachmentService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.MultiValueMap;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserCourseUserCourseAttachmentServiceImpl implements UserCourseAttachmentService {

    private final UserCourseAttachmentRepository userCourseAttachmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private static final String UPLOAD_DIR_PATH = "uploads";

    @Override
    public UserCourseAttachment uploadAttachment(UserCourseAttachmentRequestDTO dto) {
        MultipartFile multipartFile = dto.getFile();

        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        if (!Objects.requireNonNull(dto.getFile().getOriginalFilename()).toLowerCase().endsWith(".pdf")) {
            throw new InvalidArgumentsException("Only PDF files can be accpeted!");
        }

        PDDocument document = null;
        try {
            document = PDDocument.load(dto.getFile().getInputStream());
        } catch (IOException e) {
            throw new PDFLoadingException();
        }
        int numPages = document.getNumberOfPages();
        if (numPages < 1 || numPages > 3) {
            throw new InvalidArgumentsException("PDFs must be between 1 and 3 pages!");
        }

        File dir = new File(UPLOAD_DIR_PATH);
        if (!dir.mkdirs() && !dir.isDirectory()) {
            throw new FileUploadFailureException();
        }

        byte[] fileBytes;
        try {
            fileBytes = multipartFile.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Error reading file bytes", e);
        }

        UUID id = pineconeUploadAttachment(fileBytes);

        String originalFilename = multipartFile.getOriginalFilename();
        String uniqueFilename = id + "_" + originalFilename;
        String filePath = UPLOAD_DIR_PATH + File.separator + uniqueFilename;

        File dest = new File(filePath);
        try {
            multipartFile.transferTo(dest.toPath());
        } catch (IOException e) {
            throw new FileUploadFailureException();
        }

        UserCourseAttachment attachment = new UserCourseAttachment();
        attachment.setId(id);
        attachment.setOriginalFileName(dto.getFile().getOriginalFilename());
        attachment.setSavedFileName(uniqueFilename);
        //filepath will be for example uploads/test.pdf while the url to access the file will be localhost:8080/files/test.pdf
        attachment.setFilePath(filePath);
        attachment.setFileUrl("/files/" + uniqueFilename);

        attachment.setFileType("pdf");
        attachment.setUploadedAt(LocalDateTime.now());
        attachment.setUser(userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(User.class, dto.getUserId().toString())));
        attachment.setCourse(courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, dto.getCourseId().toString())));

        return userCourseAttachmentRepository.save(attachment);
    }

    @Override
    public List<UserCourseAttachment> getAllAttachments() {
        return userCourseAttachmentRepository.findAll();
    }

    @Override
    public List<UserCourseAttachment> getAttachmentsByUser(Long userId) {
        return userCourseAttachmentRepository.findAllByUserId(userId);
    }

    @Override
    public List<UserCourseAttachment> getAttachmentsByCourse(Long courseId) {
        return userCourseAttachmentRepository.findAllByCourseId(courseId);
    }

    @Override
    public List<UserCourseAttachment> getAttachmentsByCourseAndUser(Long courseId, Long userId) {
        return userCourseAttachmentRepository.findAllByCourseIdAndUserId(courseId, userId);
    }

    @Override
    public UserCourseAttachment getById(UUID id) {
        return userCourseAttachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(UserCourseAttachment.class, id.toString()));
    }

    public UUID pineconeUploadAttachment(byte[] attachment) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(attachment) {
            @Override
            public String getFilename() {
                return "document.pdf";
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        String fastApiUrl = "http://localhost:8000/upload_file";
        try {
            ResponseEntity<AttachmentIDResponseDTO> response = restTemplate.postForEntity(fastApiUrl, requestEntity,
                    AttachmentIDResponseDTO.class);
            return UUID.fromString(response.getBody().getId());
        } catch (Exception e) {
            e.printStackTrace();
            throw new FileUploadFailureException();
        }

    }

    @Override
    public AskQuestionResponseDTO askQuestion(AskQuestionRequestDTO askQuestionRequestDTO) {
        String question = askQuestionRequestDTO.getQuestion();
        String pdfId = askQuestionRequestDTO.getPdf_id();
        UUID id = UUID.fromString(pdfId);
        UserCourseAttachment attachment = getById(id);
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("question", question);
        body.put("pdf_id", pdfId);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);
        String fastApiUrl = "http://localhost:8000/ask";
        try {
            ResponseEntity<AskQuestionResponseDTO> response = restTemplate.postForEntity(fastApiUrl, requestEntity,
                    AskQuestionResponseDTO.class);
            return response.getBody();
        } catch (Exception e) {
            throw new AskQuestionException();
        }

    }

    @Override
    public void deleteAttachment(UUID id) throws FileNotFoundException {
        UserCourseAttachment attachment = userCourseAttachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(UserCourseAttachment.class, id.toString()));

        Path filePath = Paths.get(attachment.getFilePath());
        try {
            if(Files.deleteIfExists(filePath)){
                userCourseAttachmentRepository.delete(attachment);
            }
        } catch (IOException e) {
            throw new FileNotFoundException();
        }
    }
}
