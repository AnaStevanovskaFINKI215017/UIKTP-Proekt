package com.uiktp.service.Interface;

import com.uiktp.model.Comment;
import com.uiktp.model.dtos.CommentDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface CommentService {
    List<Comment> getAllCommentsForCourse(Long courseId);
    Comment addCommentToCourse(Long courseId, CommentDTO dto);
    Comment editComment(Long commentId, CommentDTO dto);
    void deleteComment(Long courseId, Long commentId, String email);
}
