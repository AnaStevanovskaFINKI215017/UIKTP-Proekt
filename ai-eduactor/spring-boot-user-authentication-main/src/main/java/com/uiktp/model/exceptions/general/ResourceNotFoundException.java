package com.uiktp.model.exceptions.general;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(Class<?> entityType, String entityId) {
        super(String.format("%s with id: %s not found", entityType.getSimpleName(), entityId));
    }
}