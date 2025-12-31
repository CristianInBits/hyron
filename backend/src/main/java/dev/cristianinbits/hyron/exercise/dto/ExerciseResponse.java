package dev.cristianinbits.hyron.exercise.dto;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;

public record ExerciseResponse(
    Long id,
    String name,
    MuscleGroup muscleGroup,
    String notes,
    boolean isUnilateral,
    boolean active
) {}