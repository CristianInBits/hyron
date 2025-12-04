package dev.cristianinbits.hyron.workout.dto;

import java.time.LocalDateTime;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;

public record WorkoutDetailResponse(
        Long id,
        Long userId,
        WorkoutType type,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Integer globalRpe,
        String notes,
        String location,
        String source,
        boolean hasHyroxDetails,
        boolean hasRunDetails,
        boolean hasSwimDetails,
        boolean hasGymDetails
) {
}