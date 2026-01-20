package dev.cristianinbits.hyron.common.exception;

/**
 * Excepción para peticiones sin autenticación válida.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}