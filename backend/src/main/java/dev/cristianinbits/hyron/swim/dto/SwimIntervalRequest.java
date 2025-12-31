package dev.cristianinbits.hyron.swim.dto;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.cristianinbits.hyron.swim.domain.SwimEquipment;
import dev.cristianinbits.hyron.swim.domain.SwimIntervalType;
import dev.cristianinbits.hyron.swim.domain.SwimStroke;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record SwimIntervalRequest(

    @NotNull 
    SwimIntervalType type,
    
    @NotNull
    SwimStroke stroke,

    @PositiveOrZero
    Integer distanceMeters,

    @Positive
    Integer durationSeconds,

    @PositiveOrZero
    Integer restSeconds,

    @Min(1)
    @Max(10)
    Integer rpe,

    Set<SwimEquipment> equipment, // Puede ser null o vacío

    @Size(max = 4000)
    String notes
) {
    public SwimIntervalRequest {
        if (notes != null) notes = notes.trim();
        if (equipment == null) equipment = Set.of();
    }

    // 🔥 Validación lógica: O nadas distancia, O nadas tiempo
    @AssertTrue(message = "Interval must have either distance or duration")
    @JsonIgnore
    public boolean isContentValid() {
        return distanceMeters != null || durationSeconds != null;
    }
}