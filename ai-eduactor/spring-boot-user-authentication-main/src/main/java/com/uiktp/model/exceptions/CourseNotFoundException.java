package com.uiktp.model.exceptions;

public class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException(){
        super("Course with that id doesn't exist");
    }
}
