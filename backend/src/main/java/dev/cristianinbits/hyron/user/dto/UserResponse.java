package dev.cristianinbits.hyron.user.dto;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        LocalDateTime registeredAt
) { }
