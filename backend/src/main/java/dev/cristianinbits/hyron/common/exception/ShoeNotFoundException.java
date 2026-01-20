package dev.cristianinbits.hyron.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ShoeNotFoundException extends RuntimeException {
    public ShoeNotFoundException(Long id) {
        super("No se encontró la zapatilla con id: " + id);
    }
}