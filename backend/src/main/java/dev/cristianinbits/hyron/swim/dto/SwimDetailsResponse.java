package dev.cristianinbits.hyron.swim.dto;

import java.util.List;

import dev.cristianinbits.hyron.swim.domain.PoolType;

public record SwimDetailsResponse(
    Long id,
    Long workoutId,
    PoolType poolType,
    Integer totalDistanceMeters,
    Integer totalTimeSeconds,
    String notes,
    Integer averagePaceSecondsPer100m,
    List<SwimIntervalResponse> intervals
) {}