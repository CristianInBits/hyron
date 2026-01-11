package dev.cristianinbits.hyron.common.exception;

import org.postgresql.util.PSQLException;
import org.postgresql.util.ServerErrorMessage;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.http.converter.HttpMessageNotReadableException;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolationException;

import java.sql.SQLException;
import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, "CONFLICT", ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException ex) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {

        String constraintName = extractConstraintName(ex);
        String sqlState = extractSqlState(ex);

        if ("23505".equals(sqlState)) {
            String userMessage = mapUniqueConstraintToMessage(constraintName);
            return buildErrorResponse(HttpStatus.CONFLICT, "CONFLICT", userMessage);
        }

        if ("23503".equals(sqlState)) {
            return buildErrorResponse(
                    HttpStatus.CONFLICT,
                    "CONFLICT",
                    "Referenced entity does not exist or is in use");
        }

        if ("23502".equals(sqlState)) {
            return buildErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "BAD_REQUEST",
                    "Required field is missing");
        }

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                "Data integrity error");
    }

    private String extractConstraintName(DataIntegrityViolationException ex) {
        Throwable cause = ex.getMostSpecificCause();

        if (cause instanceof PSQLException psqlEx) {
            ServerErrorMessage serverError = psqlEx.getServerErrorMessage();
            if (serverError != null) {
                return serverError.getConstraint();
            }
        }

        return null;
    }

    private String extractSqlState(DataIntegrityViolationException ex) {
        Throwable cause = ex.getMostSpecificCause();

        if (cause instanceof PSQLException psqlEx) {
            return psqlEx.getSQLState();
        }

        if (cause instanceof SQLException sqlEx) {
            return sqlEx.getSQLState();
        }

        return null;
    }

    private String mapUniqueConstraintToMessage(String constraintName) {
        if (constraintName == null) {
            return "Duplicate entry detected";
        }

        return switch (constraintName) {
            case "uk_users_email" -> "Email already in use";
            case "uk_hyrox_blocks_details_order" -> "Block order already exists";
            case "uk_hyrox_block_items_block_order" -> "Item order already exists";
            // Añade más según crees constraints
            default -> "Duplicate entry detected";
        };
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", message);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {

        String message = ex.getConstraintViolations()
                .stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.joining("; "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", message);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Malformed JSON request");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        // TODO: Log stacktrace here for debugging
        // log.error("Unexpected error", ex);
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                "Unexpected error occurred");
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(HttpStatus status, String error, String message) {
        ErrorResponse body = new ErrorResponse(
                Instant.now(),
                status.value(),
                error,
                message);
        return ResponseEntity.status(status).body(body);
    }

    public record ErrorResponse(
            Instant timestamp,
            int status,
            String error,
            String message) {
    }
}
