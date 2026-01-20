package dev.cristianinbits.hyron.common.web;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

import java.util.List;

/**
 * Parámetros de paginación y ordenación para endpoints.
 *
 * <p>Convención:
 * <ul>
 *   <li>page: 0-based</li>
 *   <li>size: tamaño de página</li>
 *   <li>sort: lista de "campo,direccion" (p. ej. "brand,asc")</li>
 * </ul>
 */
public record PageQuery(

    @Min(0)
    Integer page,

    @Min(1)
    @Max(100)
    Integer size,

    /**
         * Multi-sort. Ej:
         * sort=brand,asc&sort=model,desc
         *
         * campo se valida por whitelist en PageQueryMapper.
         * direction: asc|desc (case-insensitive). Si no se indica, default ASC.
         */
        List<@Pattern(
                regexp = "^[a-zA-Z0-9_]+(,(?i)(asc|desc))?$",
                message = "sort debe ser 'campo' o 'campo,asc|desc'"
        ) String> sort
) {
    public int pageOrDefault(int defaultPage) {
        return page != null ? page : defaultPage;
    }

    public int sizeOrDefault(int defaultSize) {
        return size != null ? size : defaultSize;
    }
}