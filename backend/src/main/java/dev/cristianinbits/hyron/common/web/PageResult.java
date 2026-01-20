package dev.cristianinbits.hyron.common.web;

import java.util.List;

/**
 * Resultado paginado para respuestas API.
 *
 * @param content elementos de la página
 * @param page índice de página (0-based)
 * @param size tamaño de página
 * @param totalElements total de elementos
 * @param totalPages total de páginas
 * @param first si es la primera página
 * @param last si es la última página
 * @param hasNext si hay siguiente página
 * @param hasPrevious si hay página anterior
 */
public record PageResult<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last,
    boolean hasNext,
    boolean hasPrevious
) {}