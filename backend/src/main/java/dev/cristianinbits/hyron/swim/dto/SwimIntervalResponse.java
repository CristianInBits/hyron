package dev.cristianinbits.hyron.swim.dto;

import java.util.Set;

import dev.cristianinbits.hyron.swim.domain.SwimEquipment;
import dev.cristianinbits.hyron.swim.domain.SwimIntervalType;
import dev.cristianinbits.hyron.swim.domain.SwimStroke;

public record SwimIntervalResponse(
    Long id,
    Integer orderIndex,
    SwimIntervalType type,
    SwimStroke stroke,
    Integer distanceMeters,
    Integer durationSeconds,
    Integer restSeconds,
    Integer rpe,
    Set<SwimEquipment> equipment,
    String notes,
    Integer paceSecondsPer100m // Calculado para el frontend
) {}