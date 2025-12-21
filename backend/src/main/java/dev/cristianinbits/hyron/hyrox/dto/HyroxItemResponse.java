package dev.cristianinbits.hyron.hyrox.dto;

import java.math.BigDecimal;

import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;

public record HyroxItemResponse(
    Long id,
    Integer orderIndex,
    HyroxStation station,
    Integer duration,
    Integer recoveryDuration,
    Integer distance,
    Integer reps,
    BigDecimal weight,
    Integer averageHr,
    Integer rpe,
    String notes,
    Integer paceSecondsPerKm
) { }