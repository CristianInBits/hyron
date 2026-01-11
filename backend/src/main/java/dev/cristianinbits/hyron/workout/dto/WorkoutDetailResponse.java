package dev.cristianinbits.hyron.workout.dto;

import java.time.Instant;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;

public record WorkoutDetailResponse(
        Long id,
        Long userId,
        WorkoutType type,
        Instant startDateTime,
        Instant endDateTime,
        Integer globalRpe,
        String notes,
        String location,
        String source,
        Long hyroxDetailsId,
        Long runDetailsId,
        Long swimDetailsId,
        Long gymDetailsId
) {
}