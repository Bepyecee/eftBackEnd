package com.example.investmenttracker.exception;

/**
 * Thrown when a create/update would violate a uniqueness or other conflict
 * constraint.
 */
public class ResourceConflictException extends RuntimeException {
    public ResourceConflictException(String message) {
        super(message);
    }

    public ResourceConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
