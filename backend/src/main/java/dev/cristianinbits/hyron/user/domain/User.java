package dev.cristianinbits.hyron.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * JPA entity representing an application user.
 *
 * This entity maps to the {@code users} table and stores the core user information,
 * including name, email address and the registration timestamp.
 *
 * The email field is enforced as unique at the database level.
 * The registration timestamp is automatically populated when the entity
 * is first persisted, using Spring Data JPA auditing.
 */
@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_email", columnNames = "email")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    /**
     * Primary key identifier of the user.
     *
     * This value is generated automatically by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    /**
     * Display name of the user.
     *
     * Must not be null and is limited to 100 characters.
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Email address of the user.
     *
     * This value must be unique and is stored in normalized form.
     * Maximum length is 255 characters.
     */
    @Column(nullable = false, length = 255)
    private String email;

    /**
     * Timestamp indicating when the user was registered.
     *
     * This field is automatically set on entity creation and
     * cannot be updated afterwards.
     */
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant registeredAt;
}