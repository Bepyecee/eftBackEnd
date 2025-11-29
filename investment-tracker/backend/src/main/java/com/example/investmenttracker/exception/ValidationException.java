package com.example.investmenttracker.exception;

/**
 * Exception used for validation errors with a message code and optional args
 * to be resolved by Spring's MessageSource.
 */
public class ValidationException extends RuntimeException {
    private final String code;
    private final transient Object[] args;

    public ValidationException(String code, Object... args) {
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
