package dev.cristianinbits.hyron.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO (Data Transfer Object) para la creación de un nuevo usuario.
 * 
 * Este record encapsula los datos necesarios para registrar un usuario.
 * Todos los campos son obligatorios y se validan automáticamente
 * gracias a las anotaciones de Bean Validation.
 * 
 * ¿Por qué usar un record?
 * - Inmutable por defecto (los datos no pueden modificarse después de crear el objeto)
 * - Genera automáticamente constructor, getters, equals, hashCode y toString
 * - Sintaxis concisa, ideal para DTOs
 * 
 * ¿Por qué un DTO separado de la entidad?
 * - Desacopla la API de la estructura de la base de datos
 * - Permite validar solo los campos que el cliente debe enviar
 * - Evita exponer campos internos (como id o registeredAt)
 * 
 * @param name  Nombre del usuario. No puede estar vacío ni exceder 100 caracteres.
 * @param email Email del usuario. Debe ser válido y no exceder 255 caracteres.
 */
public record UserCreateRequest(

        /**
         * Nombre completo del usuario.
         * 
         * Validaciones:
         * - @NotBlank: No puede ser null, vacío, ni solo espacios en blanco
         * - @Size(max = 100): Máximo 100 caracteres (coincide con la columna en BD)
         */
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String name,

        /**
         * Dirección de correo electrónico.
         * 
         * Validaciones:
         * - @NotBlank: No puede ser null, vacío, ni solo espacios en blanco
         * - @Email: Debe tener formato de email válido (usuario@dominio.com)
         * - @Size(max = 255): Máximo 255 caracteres (coincide con la columna en BD)
         */
        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email debe tener un formato válido")
        @Size(max = 255, message = "El email no puede exceder 255 caracteres")
        String email

) { }
