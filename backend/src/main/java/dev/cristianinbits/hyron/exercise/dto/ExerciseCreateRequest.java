package dev.cristianinbits.hyron.exercise.dto;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ExerciseCreateRequest(

    @NotBlank
    @Size(max = 100)
    String name,

    @NotNull
    MuscleGroup muscleGroup,

    @Size(max = 255)
    String notes,

    Boolean isUnilateral

) {
    public ExerciseCreateRequest {
        if (name != null) name = name.trim();
        if (notes != null) notes = notes.trim();
        if (isUnilateral == null) isUnilateral = false;
    }
}