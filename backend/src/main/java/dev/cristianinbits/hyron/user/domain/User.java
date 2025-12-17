package dev.cristianinbits.hyron.user.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Entidad que representa un usuario en el sistema.
 * 
 * Esta clase es una entidad JPA que se mapea a la tabla "users" en la base de datos.
 * Contiene la información básica de un usuario: nombre, email y fecha de registro.
 * 
 * Características importantes:
 * - El email debe ser único (constraint uk_users_email)
 * - La fecha de registro se asigna automáticamente al persistir
 * - equals() y hashCode() solo consideran el id para evitar problemas con colecciones JPA
 * 
 * @author Hyron Training
 * @version 1.0
 */
@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_users_email",  // Nombre descriptivo para mensajes de error
            columnNames = "email"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)  // Previene problemas con relaciones lazy en el futuro
@EqualsAndHashCode(onlyExplicitlyIncluded = true)  // Solo usa campos marcados explícitamente
public class User {

    /**
     * Identificador único del usuario.
     * 
     * Es la clave primaria de la tabla y se genera automáticamente
     * usando la estrategia IDENTITY (auto-incremento de la BD).
     * 
     * Se incluye en equals/hashCode porque es lo que identifica
     * de forma única a un usuario en la base de datos.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long id;

    /**
     * Nombre completo del usuario.
     * 
     * Restricciones:
     * - No puede ser nulo
     * - Máximo 100 caracteres
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Dirección de correo electrónico del usuario.
     * 
     * Restricciones:
     * - No puede ser nulo
     * - Máximo 255 caracteres
     * - Debe ser único en toda la tabla (constraint uk_users_email)
     * 
     * Se normaliza a minúsculas en el servicio antes de guardar.
     */
    @Column(nullable = false, length = 255)
    @ToString.Include
    private String email;

    /**
     * Fecha y hora en que el usuario se registró en el sistema.
     * 
     * Se asigna automáticamente mediante el hook @PrePersist
     * si no se proporciona un valor explícito.
     */
    @Column(nullable = false)
    private LocalDateTime registeredAt;

    /**
     * Hook del ciclo de vida JPA que se ejecuta antes de insertar
     * la entidad en la base de datos (antes del INSERT).
     * 
     * Asigna la fecha de registro actual si no se ha establecido previamente.
     * Esto garantiza que todo usuario tenga una fecha de registro válida.
     */
    @PrePersist
    void prePersist() {
        if (registeredAt == null) {
            registeredAt = LocalDateTime.now();
        }
    }
}