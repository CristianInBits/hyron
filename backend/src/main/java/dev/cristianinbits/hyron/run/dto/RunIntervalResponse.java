package dev.cristianinbits.hyron.run.dto;

public record RunIntervalResponse(
        Long id,
        String type,
        Integer orderIndex,
        Integer distance,      // m
        Integer durationSec,   // planned duration (s)
        Integer timeSec,       // actual time (s)
        String averagePace,    // "4:30/km"
        Integer averageHr,
        Integer rpe,
        String notes
) {
}