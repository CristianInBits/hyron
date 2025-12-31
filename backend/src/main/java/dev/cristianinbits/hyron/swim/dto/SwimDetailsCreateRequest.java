package dev.cristianinbits.hyron.swim.dto;

import java.util.List;

import dev.cristianinbits.hyron.swim.domain.PoolType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record SwimDetailsCreateRequest(
    
    @NotNull(message = "Pool type is required")
    PoolType poolType,

    @Positive
    Integer totalDistanceMeters,

    @Positive
    Integer totalTimeSeconds,

    @Size(max = 4000)
    String notes,

    @NotEmpty(message = "Workout must have at least one interval")
    @Valid
    List<SwimIntervalRequest> intervals
) {
    public SwimDetailsCreateRequest {
        if (notes != null) notes = notes.trim();
    }
}