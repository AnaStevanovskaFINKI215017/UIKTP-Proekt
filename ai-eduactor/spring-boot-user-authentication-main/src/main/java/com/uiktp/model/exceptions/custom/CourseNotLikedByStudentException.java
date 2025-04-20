package com.uiktp.model.exceptions.custom;

public class CourseNotLikedByStudentException extends RuntimeException{
    public CourseNotLikedByStudentException(Long courseId, Long studentId){
        super(String.format("Course with id: %d is not part of the favorite courses of student with id: %d", courseId, studentId));
    }
}
