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

    // Usar @DecimalMin/Max para Double es lo correcto
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

    // Integración con Bean Validation
    // El nombre del método suele empezar por 'is' para que Jackson/Hibernate lo detecten
    @AssertTrue(message = "Set must have either reps or execution time")
    @JsonIgnore // Para que no aparezca en el Swagger/Docs como un campo extra
    public boolean isContentValid() {
        return reps != null || executionSeconds != null;
    }
}