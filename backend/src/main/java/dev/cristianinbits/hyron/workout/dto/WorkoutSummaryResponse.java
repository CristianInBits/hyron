package dev.cristianinbits.hyron.workout.dto;

import java.time.Instant;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;

/**
 * Lightweight workout representation for list views.
 */
public record WorkoutSummaryResponse(
        Long id,
        WorkoutType type,
        Instant startDateTime,
        Instant endDateTime,
        Integer globalRpe,
        String location
) { }