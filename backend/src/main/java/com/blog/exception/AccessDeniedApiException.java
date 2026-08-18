package com.blog.exception;

import org.springframework.http.HttpStatus;

public class AccessDeniedApiException extends ApiException {
    public AccessDeniedApiException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
