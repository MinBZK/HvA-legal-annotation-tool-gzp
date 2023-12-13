package com.LAT.backend.exceptions;

public class LawClassNotFoundException extends RuntimeException {
    public LawClassNotFoundException(String message) {
        super(message);
    }
}
