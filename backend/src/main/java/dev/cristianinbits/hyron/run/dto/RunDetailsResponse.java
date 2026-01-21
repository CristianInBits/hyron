package dev.cristianinbits.hyron.run.dto;

import java.util.List;

import dev.cristianinbits.hyron.shoe.dto.ShoeResponse;

public record RunDetailsResponse(
        Long id,
        Long workoutId,
        Integer totalDistanceMeters,
        Integer totalDurationSeconds,
        Integer totalElevationGain,
        Integer averageHr,
        ShoeResponse shoe,
        String notes,
        Integer averagePaceSecondsPerKm,
        List<RunIntervalResponse> intervals
) { }