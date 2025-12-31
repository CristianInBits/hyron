package dev.cristianinbits.hyron.exercise.dto;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;

public record ExerciseSummaryResponse(
    Long id,
    String name,
    MuscleGroup muscleGroup,
    boolean isUnilateral
) {}