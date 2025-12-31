package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;

public record GymExerciseResponse(
    Long id,
    Integer orderIndex,
    String supersetId,
    String notes,
    Long exerciseId,
    String exerciseName,
    MuscleGroup muscleGroup,
    boolean isUnilateral,
    List<GymSetResponse> sets
) {}