package dev.cristianinbits.hyron.user.dto;

import java.time.Instant;

/**
 * Response DTO representing a user returned by the API.
 *
 * This object is used to expose user data to API consumers
 * without leaking internal entity details.
 */
public record UserResponse(

    /**
     * Unique identifier of the user.
     */
    Long id,

    /**
     * Name of the user.
     */
    String name,

    /**
     * Email address of the user.
     */
    String email,

    /**
     * Timestamp indicating when the user was registered.
     */
    Instant registeredAt

) { }