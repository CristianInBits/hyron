package dev.cristianinbits.hyron.run.dto;

import dev.cristianinbits.hyron.run.domain.RunIntervalType;

public record RunIntervalResponse(
        Long id,
        Integer orderIndex,
        RunIntervalType type,
        Integer durationSeconds,
        Integer distanceMeters,
        Integer averageHr,
        Integer cadenceSpm,
        Integer elevationGain,
        String notes,
        Integer paceSecondsPerKm
) { }