package dev.cristianinbits.hyron.user.dto;

import java.time.LocalDateTime;

/**
 * DTO (Data Transfer Object) para las respuestas de la API relacionadas con usuarios.
 * 
 * Este record representa la información de un usuario que se devuelve al cliente.
 * Se usa tanto para respuestas individuales (getUserById) como para listas (getAllUsers).
 * 
 * Diferencia con la entidad User:
 * - La entidad tiene anotaciones JPA y lógica de persistencia
 * - Este DTO es una representación "limpia" para la API
 * - Permite controlar exactamente qué campos se exponen al cliente
 * 
 * Si en el futuro la entidad User tiene campos sensibles (como password),
 * este DTO los excluiría automáticamente al no incluirlos aquí.
 * 
 * @param id           Identificador único del usuario
 * @param name         Nombre completo del usuario
 * @param email        Dirección de correo electrónico
 * @param registeredAt Fecha y hora de registro en el sistema
 */
public record UserResponse(

        /**
         * Identificador único del usuario en la base de datos.
         * Generado automáticamente al crear el usuario.
         */
        Long id,

        /**
         * Nombre completo del usuario.
         */
        String name,

        /**
         * Dirección de correo electrónico del usuario.
         * Siempre se devuelve normalizado (en minúsculas, sin espacios).
         */
        String email,

        /**
         * Fecha y hora en que el usuario se registró.
         * Formato ISO 8601: "2024-01-15T10:30:00"
         */
        LocalDateTime registeredAt

) { }