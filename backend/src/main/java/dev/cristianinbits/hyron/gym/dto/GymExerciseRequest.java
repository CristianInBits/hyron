package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record GymExerciseRequest(
    
    @Positive
    @NotNull(message = "Exercise ID is required")
    Long exerciseId,

    @Size(max = 36)
    String supersetId,

    @Size(max = 1000)
    String notes,

    @NotEmpty(message = "El ejercicio debe tener al menos una serie")
    @Valid List<GymSetRequest> sets
) {
    public GymExerciseRequest {
        if (notes != null)
            notes = notes.trim();
        if (supersetId != null)
            supersetId = supersetId.trim();
    }
}