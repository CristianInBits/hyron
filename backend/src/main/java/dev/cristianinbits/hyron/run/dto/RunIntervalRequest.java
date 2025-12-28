package dev.cristianinbits.hyron.run.dto;

import dev.cristianinbits.hyron.run.domain.RunIntervalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record RunIntervalRequest(

    @NotNull
    RunIntervalType type,

    @NotNull
    @Positive
    Integer durationSeconds,

    @PositiveOrZero
    Integer distanceMeters,

    @Positive
    Integer averageHr,

    @Positive
    Integer cadenceSpm,

    @PositiveOrZero
    Integer elevationGain,
        
    @Size(max = 4000)
    String notes

) {
    public RunIntervalRequest {
        if (notes != null)
            notes = notes.trim();
    }
}
