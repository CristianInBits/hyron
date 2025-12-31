package dev.cristianinbits.hyron.gym.dto;

import dev.cristianinbits.hyron.gym.domain.GymSetType;

public record GymSetResponse(
    Long id,
    Integer orderIndex,
    GymSetType type,
    Double weightKg,
    Integer reps,
    Double rpe,
    Integer restSeconds,
    Integer executionSeconds,
    String notes
) {}