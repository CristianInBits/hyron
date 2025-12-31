package dev.cristianinbits.hyron.exercise.dto;

import dev.cristianinbits.hyron.common.validation.NullOrNotBlank;
import dev.cristianinbits.hyron.gym.domain.MuscleGroup;
import jakarta.validation.constraints.Size;

public record ExerciseUpdateRequest(

    @NullOrNotBlank
    @Size(max = 100)
    String name,

    MuscleGroup muscleGroup,

    @Size(max = 255)
    String notes,

    Boolean isUnilateral,

    Boolean active

) {
    public ExerciseUpdateRequest {
        if (name != null)
            name = name.trim();
        if (notes != null)
            notes = notes.trim();
    }
}