package dev.cristianinbits.hyron.common.security;

/**
 * Servicio para obtener información del usuario autenticado.
 */
public interface CurrentUserService {

    /**
     * Obtiene el id del usuario autenticado o lanza excepción si no hay sesión válida.
     *
     * @return id del usuario autenticado
     */
    Long requireUserId();
}