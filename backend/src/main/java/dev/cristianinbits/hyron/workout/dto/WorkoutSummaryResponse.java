package dev.cristianinbits.hyron.workout.dto;

import java.time.LocalDateTime;

import dev.cristianinbits.hyron.workout.domain.WorkoutType;

public record WorkoutSummaryResponse(
        Long id,
        WorkoutType type,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Integer globalRpe,
        String location
) {}