package dev.cristianinbits.hyron.shoe.service;

import dev.cristianinbits.hyron.common.web.PageQuery;
import dev.cristianinbits.hyron.common.web.PageResult;
import dev.cristianinbits.hyron.shoe.domain.ShoeType;
import dev.cristianinbits.hyron.shoe.dto.ShoeCreateRequest;
import dev.cristianinbits.hyron.shoe.dto.ShoeResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeUpdateRequest;

/**
 * Casos de uso del dominio de zapatillas.
 */
public interface ShoeService {

    /**
     * Crea una zapatilla para el usuario autenticado.
     *
     * @param request datos de creación
     * @return zapatilla creada
     */
    ShoeResponse create(ShoeCreateRequest request);

    /**
     * Reemplaza (PUT) los datos de una zapatilla del usuario autenticado.
     * No modifica la distancia acumulada registrada por la app.
     *
     * @param id      identificador de la zapatilla
     * @param request datos completos de reemplazo
     * @return zapatilla actualizada
     */
    ShoeResponse update(Long id, ShoeUpdateRequest request);

    /**
     * Obtiene una zapatilla del usuario autenticado por id.
     *
     * @param id identificador de la zapatilla
     * @return zapatilla encontrada
     */
    ShoeResponse getById(Long id);

    /**
     * Lista zapatillas paginadas del usuario autenticado con filtros.
     *
     * @param type      filtrar por tipo (null = cualquiera)
     * @param active    filtrar por estado (null = cualquiera)
     * @param pageQuery parámetros de paginación y orden (page, size, sort)
     * @return página de resultados con metadatos
     */
    PageResult<ShoeResponse> getMyShoes(ShoeType type, Boolean active, PageQuery pageQuery);

    /**
     * Soft delete: desactiva la zapatilla (active=false) del usuario autenticado.
     *
     * @param id identificador de la zapatilla
     */
    void delete(Long id);
}