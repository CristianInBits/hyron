package dev.cristianinbits.hyron.user.dto;

import java.time.Instant;

public record UserResponse(
    Long id,
    String name,
    String email,
    Instant registeredAt
) { }