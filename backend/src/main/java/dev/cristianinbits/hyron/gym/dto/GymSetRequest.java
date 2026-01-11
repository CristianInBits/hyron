package dev.cristianinbits.hyron.gym.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.cristianinbits.hyron.gym.domain.GymSetType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record GymSetRequest(
    @NotNull
    GymSetType type,

    @PositiveOrZero
    Double weightKg,

    @Positive
    Integer reps,

    @Positive
    Integer executionSeconds,

    @DecimalMin(value = "0.0", message = "RPE must be at least 0")
    @DecimalMax(value = "10.0", message = "RPE must be at most 10")
    Double rpe,

    @PositiveOrZero
    Integer restSeconds,

    @Size(max = 500)
    String notes
) {
    public GymSetRequest {
        if (notes != null) notes = notes.trim();
    }

    @AssertTrue(message = "Set must have either reps or execution time")
    @JsonIgnore
    public boolean isContentValid() {
        return reps != null || executionSeconds != null;
    }
}