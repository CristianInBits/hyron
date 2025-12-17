package dev.cristianinbits.hyron.exception;

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

    // ==========
    // Custom domain exceptions
    // ==========

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

    // ==========
    // Database constraint violations (unique keys, FK, etc.) → 409
    // ==========

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {

        // Intentar obtener información específica de Postgres
        String constraintName = extractConstraintName(ex);
        String sqlState = extractSqlState(ex);

        // SQLSTATE 23505 = unique_violation en Postgres
        if ("23505".equals(sqlState)) {
            String userMessage = mapUniqueConstraintToMessage(constraintName);
            return buildErrorResponse(HttpStatus.CONFLICT, "CONFLICT", userMessage);
        }

        // SQLSTATE 23503 = foreign_key_violation
        if ("23503".equals(sqlState)) {
            return buildErrorResponse(
                    HttpStatus.CONFLICT,
                    "CONFLICT",
                    "Referenced entity does not exist or is in use");
        }

        // SQLSTATE 23502 = not_null_violation
        if ("23502".equals(sqlState)) {
            return buildErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "BAD_REQUEST",
                    "Required field is missing");
        }

        // Otros casos de integridad no identificados → 500 para investigar
        // En producción podrías loguear ex para debug
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                "Data integrity error");
    }

    /**
     * Extrae el nombre del constraint desde la excepción de Postgres.
     */
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

    /**
     * Extrae el SQLSTATE desde la excepción de Postgres.
     */
    private String extractSqlState(DataIntegrityViolationException ex) {
        Throwable cause = ex.getMostSpecificCause();

        if (cause instanceof PSQLException psqlEx) {
            return psqlEx.getSQLState();
        }

        // Fallback para SQLException genérica
        if (cause instanceof SQLException sqlEx) {
            return sqlEx.getSQLState();
        }

        return null;
    }

    /**
     * Mapea constraint names conocidos a mensajes de usuario.
     */
    private String mapUniqueConstraintToMessage(String constraintName) {
        if (constraintName == null) {
            return "Duplicate entry detected";
        }

        return switch (constraintName) {
            case "uk_users_email" -> "Email already in use";
            case "uk_hyrox_blocks_details_order" -> "Block order already exists";
            case "uk_hyrox_block_items_block_order" -> "Item order already exists";
            // Añade más según crees constraints
            default -> "Duplicate entry detected: ";
        };
    }

    // ==========
    // Validation errors (@Valid in @RequestBody) → 400
    // ==========

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", message);
    }

    // ==========
    // Validation errors in @PathVariable, @RequestParam, etc. → 400
    // ==========

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {

        String message = ex.getConstraintViolations()
                .stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.joining("; "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", message);
    }

    // ==========
    // Malformed JSON, incorrect types, etc. → 400
    // ==========

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Malformed JSON request");
    }

    // ==========
    // Catch-all → 500
    // ==========

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        // TODO: Log stacktrace here for debugging
        // log.error("Unexpected error", ex);
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                "Unexpected error occurred");
    }

    // ==========
    // Helper
    // ==========

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
