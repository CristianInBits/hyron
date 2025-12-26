package dev.cristianinbits.hyron.hyrox.dto;

import java.math.BigDecimal;

import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;

public record HyroxItemResponse(
    Long id,
    Integer orderIndex,
    HyroxStation station,
    Integer durationSeconds,
    Integer recoveryDurationSeconds,
    Integer distanceMeters,
    Integer reps,
    BigDecimal weightKg,
    Integer averageHr,
    Integer rpe,
    String notes,
    Integer paceSecondsPerKm
) { }