package com.example.investmenttracker.exception;

/**
 * Thrown when a create/update would violate a uniqueness or other conflict
 * constraint.
 */
public class ResourceConflictException extends RuntimeException {
    private final String code;
    private final transient Object[] args;

    public ResourceConflictException(String message) {
        super(message);
        this.code = null;
        this.args = new Object[0];
    }

    public ResourceConflictException(String message, Throwable cause) {
        super(message, cause);
        this.code = null;
        this.args = new Object[0];
    }

    /**
     * Create with a message code and optional arguments to be resolved by
     * MessageSource.
     */
    public ResourceConflictException(String code, Object... args) {
        super(code);
        this.code = code;
        this.args = args != null ? args : new Object[0];
    }

    public String getCode() {
        return code;
    }

    public Object[] getArgs() {
        return args;
    }
}
