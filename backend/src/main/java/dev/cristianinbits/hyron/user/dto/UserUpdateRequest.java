package dev.cristianinbits.hyron.user.dto;

import dev.cristianinbits.hyron.common.validation.NullOrNotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * DTO (Data Transfer Object) para la actualización parcial de un usuario.
 * 
 * Este record permite actualizar uno o más campos de un usuario existente.
 * Todos los campos son opcionales (pueden ser null), lo que permite
 * actualizaciones parciales usando el método HTTP PATCH.
 * 
 * Diferencia entre PUT y PATCH:
 * - PUT: Reemplaza TODO el recurso (todos los campos son obligatorios)
 * - PATCH: Actualiza SOLO los campos enviados (campos opcionales)
 * 
 * Ejemplo de uso:
 * - Actualizar solo el nombre: {"name": "Nuevo Nombre"}
 * - Actualizar solo el email: {"email": "nuevo@email.com"}
 * - Actualizar ambos: {"name": "Nuevo", "email": "nuevo@email.com"}
 * 
 * La anotación @NullOrNotBlank es custom y permite:
 * - null → válido (campo no enviado, no se actualiza)
 * - "valor" → válido (campo se actualiza)
 * - "" o "   " → inválido (no tiene sentido actualizar a vacío)
 * 
 * @param name  Nuevo nombre del usuario (opcional)
 * @param email Nuevo email del usuario (opcional)
 */
public record UserUpdateRequest(

        /**
         * Nuevo nombre del usuario.
         * 
         * Validaciones:
         * - @NullOrNotBlank: Puede ser null (no actualizar) o un valor no vacío
         * - @Size(max = 100): Si se proporciona, máximo 100 caracteres
         * 
         * Si es null, el nombre actual no se modifica.
         */
        @NullOrNotBlank(message = "El nombre no puede estar vacío si se proporciona")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String name,

        /**
         * Nuevo email del usuario.
         * 
         * Validaciones:
         * - @NullOrNotBlank: Puede ser null (no actualizar) o un valor no vacío
         * - @Email: Si se proporciona, debe tener formato válido
         * - @Size(max = 255): Si se proporciona, máximo 255 caracteres
         * 
         * Si es null, el email actual no se modifica.
         * Si se proporciona, se verifica que no esté en uso por otro usuario.
         */
        @NullOrNotBlank(message = "El email no puede estar vacío si se proporciona")
        @Email(message = "El email debe tener un formato válido")
        @Size(max = 255, message = "El email no puede exceder 255 caracteres")
        String email

) { }