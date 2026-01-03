package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record GymDetailsCreateRequest(
    
    @Positive
    Integer totalDurationSeconds,

    @Size(max = 4000)
    String notes,
    
    @NotEmpty(message = "Debes añadir al menos un ejercicio")
    @Valid
    List<GymExerciseRequest> exercises

) {
    public GymDetailsCreateRequest {
        if (notes != null)
            notes = notes.trim();
    }
}