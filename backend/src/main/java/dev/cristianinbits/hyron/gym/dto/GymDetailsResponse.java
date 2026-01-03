package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

public record GymDetailsResponse(
    Long id,
    Long workoutId,
    String notes,
    List<GymExerciseResponse> exercises,
    Integer totalDurationSeconds,
    Double totalVolumeKg
) {}