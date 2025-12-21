package dev.cristianinbits.hyron.workout.dto;

import dev.cristianinbits.hyron.workout.domain.WorkoutType;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.Instant;

/**
 * Request payload for partial workout updates (PATCH).
 * All fields are optional; only non-null values will be applied.
 */
public record WorkoutUpdateRequest(

        WorkoutType type,

        Instant startDateTime,

        Instant endDateTime,

        @Min(1)
        @Max(10)
        Integer globalRpe,

        @Size(max = 4000)
        String notes,

        @Size(max = 255)
        String location,

        @Size(max = 255)
        String source

) {
    /**
     * Cross-field validation when both dates are provided in the same request.
     * Validation against existing values is handled in the service layer.
     */
    @AssertTrue(message = "endDateTime must be after startDateTime when both are provided")
    public boolean isEndAfterStartWhenBothProvided() {
        if (startDateTime == null || endDateTime == null) return true;
        return endDateTime.isAfter(startDateTime);
    }
}