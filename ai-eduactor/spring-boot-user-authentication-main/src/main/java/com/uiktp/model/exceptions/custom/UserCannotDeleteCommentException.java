package com.uiktp.model.exceptions.custom;

public class UserCannotDeleteCommentException extends RuntimeException{
    public UserCannotDeleteCommentException(String email, Long commentId){
        super(String.format("User with email %s doesn't have privileges to delete comment %d", email, commentId));
    }
}
