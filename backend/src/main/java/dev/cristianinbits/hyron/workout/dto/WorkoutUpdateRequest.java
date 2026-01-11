package dev.cristianinbits.hyron.workout.dto;

import dev.cristianinbits.hyron.workout.domain.WorkoutType;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.Instant;

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
    @AssertTrue(message = "endDateTime must be after startDateTime when both are provided")
    public boolean isEndAfterStartWhenBothProvided() {
        if (startDateTime == null || endDateTime == null) return true;
        return endDateTime.isAfter(startDateTime);
    }
}