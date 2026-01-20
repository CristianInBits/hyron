package dev.cristianinbits.hyron.common.web;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Conversión entre PageQuery y Spring Pageable/Page con control de sort permitido.
 *
 * <p>Seguridad:
 * <ul>
 *   <li>Permite únicamente campos de ordenación incluidos en {@code allowedSorts}</li>
 *   <li>Soporta multi-sort con "campo,direccion"</li>
 *   <li>Añade desempate estable por id (si está permitido) para evitar saltos entre páginas</li>
 * </ul>
 */
public final class PageQueryMapper {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 20;

    private PageQueryMapper() { }

    public static Pageable toPageable(PageQuery query, Sort defaultSort, Map<String, String> allowedSorts) {
        return toPageable(query, DEFAULT_PAGE, DEFAULT_SIZE, defaultSort, allowedSorts);
    }

    public static Pageable toPageable(
            PageQuery query,
            int defaultPage,
            int defaultSize,
            Sort defaultSort,
            Map<String, String> allowedSorts
    ) {
        if (allowedSorts == null || allowedSorts.isEmpty()) {
            throw new IllegalArgumentException("allowedSorts no puede ser null/vacío");
        }

        int page = query != null ? query.pageOrDefault(defaultPage) : defaultPage;
        int size = query != null ? query.sizeOrDefault(defaultSize) : defaultSize;

        Sort sort = (query != null)
                ? parseSort(query.sort(), defaultSort, allowedSorts)
                : (defaultSort != null ? defaultSort : Sort.unsorted());

        return PageRequest.of(page, size, sort);
    }

    static Sort parseSort(List<String> sortParams, Sort defaultSort, Map<String, String> allowedSorts) {
        if (sortParams == null || sortParams.isEmpty()) {
            return defaultSort != null ? defaultSort : Sort.unsorted();
        }

        Sort sort = Sort.unsorted();

        for (String raw : sortParams) {
            if (raw == null || raw.isBlank()) continue;

            String[] parts = raw.split(",", 2);
            String key = parts[0].trim();
            if (key.isEmpty()) continue;

            String mappedProperty = allowedSorts.get(key);
            if (mappedProperty == null) {
                // Fail Fast: Si piden ordenar por algo ilegal, 400 Bad Request
                throw new IllegalArgumentException("Sort no permitido: '" + key + "'. Permitidos: " + allowedSorts.keySet());
            }

            Sort.Direction direction = Sort.Direction.ASC;
            if (parts.length == 2 && parts[1] != null && !parts[1].isBlank()) {
                // Uso nativo de Spring para detectar asc/desc
                direction = Sort.Direction.fromOptionalString(parts[1].trim()).orElse(Sort.Direction.ASC);
            }

            sort = sort.and(Sort.by(direction, mappedProperty));
        }

        // Si después de filtrar strings vacíos no queda nada, usar default
        if (sort.isUnsorted()) {
            sort = defaultSort != null ? defaultSort : Sort.unsorted();
        }

        // Desempate estable por ID (Stable Sort)
        // Evita que registros "bailen" entre páginas si tienen el mismo valor de ordenación
        if (allowedSorts.containsKey("id")) {
            String idProperty = allowedSorts.get("id");
            // MEJORA: Usamos Stream (estilo V1) en lugar de bucle for manual
            boolean alreadyHasId = sort.stream()
                    .anyMatch(order -> order.getProperty().equals(idProperty));
            
            if (!alreadyHasId) {
                sort = sort.and(Sort.by(Sort.Direction.ASC, idProperty));
            }
        }

        return sort;
    }

    public static <T, R> PageResult<R> toPageResult(Page<T> page, Function<T, R> mapper) {
        List<R> items = page.getContent().stream().map(mapper).toList();

        return new PageResult<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
    
    public static Set<String> allowedSortKeys(Map<String, String> allowedSorts) {
        return allowedSorts.keySet();
    }
}