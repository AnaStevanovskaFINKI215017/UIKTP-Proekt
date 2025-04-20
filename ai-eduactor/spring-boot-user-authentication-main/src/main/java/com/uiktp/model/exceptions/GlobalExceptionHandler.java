package com.uiktp.model.exceptions;

import com.uiktp.model.exceptions.custom.CourseAlreadyLikedByStudentException;
import com.uiktp.model.exceptions.custom.CourseNotLikedByStudentException;
import com.uiktp.model.exceptions.custom.UserCannotDeleteCommentException;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(CourseAlreadyLikedByStudentException.class)
    public ResponseEntity<String> handleCourseAlreadyLiked(CourseAlreadyLikedByStudentException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }

    @ExceptionHandler(CourseNotLikedByStudentException.class)
    public ResponseEntity<String> handleCourseNotLiked(CourseNotLikedByStudentException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(UserCannotDeleteCommentException.class)
    public ResponseEntity<String> handleDeleteCommentNoPrivileges(UserCannotDeleteCommentException ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }
}
