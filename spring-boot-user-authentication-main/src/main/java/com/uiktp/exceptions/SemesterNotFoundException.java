package com.uiktp.exceptions;

public class SemesterNotFoundException extends RuntimeException{

    public SemesterNotFoundException() {
        super("Semester with that id doesn't exist");
    }
}
