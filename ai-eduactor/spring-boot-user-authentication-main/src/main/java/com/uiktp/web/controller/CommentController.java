package com.uiktp.web.controller;

import com.uiktp.model.Comment;
import com.uiktp.model.User;
import com.uiktp.model.dtos.CommentDTO;
import com.uiktp.service.Interface.CommentService;
import com.uiktp.service.Interface.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/comments")
public class CommentController {
    private final CommentService commentService;
    private  final CourseService courseService;

    public CommentController(CommentService commentService, CourseService courseService) {
        this.commentService = commentService;
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long courseId) {
        return ResponseEntity.ok(commentService.getAllCommentsForCourse(courseId));
    }
    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable Long courseId, @RequestBody CommentDTO dto) {
        return ResponseEntity.ok(commentService.addCommentToCourse(courseId, dto));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> editComment(@PathVariable Long courseId, @PathVariable Long commentId, @RequestBody CommentDTO dto){
        courseService.getCourseById(courseId);
        return ResponseEntity.ok(commentService.editComment(commentId, dto));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long courseId, @PathVariable Long commentId, @RequestParam String email){
        commentService.deleteComment(courseId, commentId, email);
        return ResponseEntity.ok().build();
    }
}

