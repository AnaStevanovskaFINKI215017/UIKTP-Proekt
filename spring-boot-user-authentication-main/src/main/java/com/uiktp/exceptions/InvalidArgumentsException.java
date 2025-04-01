package com.uiktp.exceptions;

public class InvalidArgumentsException extends RuntimeException {

    public InvalidArgumentsException() {
        super("Invalid arguments exception");
    }

    public InvalidArgumentsException(String message) {
        super(message);
    }
}
