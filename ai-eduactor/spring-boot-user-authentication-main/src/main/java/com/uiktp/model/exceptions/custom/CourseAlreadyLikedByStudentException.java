package com.uiktp.model.exceptions.custom;

public class CourseAlreadyLikedByStudentException extends RuntimeException{
    public CourseAlreadyLikedByStudentException(Long courseId, Long studentId){
        super(String.format("Course with id: %d was already added to favorites from user with id: %d", courseId, studentId));
    }
}
