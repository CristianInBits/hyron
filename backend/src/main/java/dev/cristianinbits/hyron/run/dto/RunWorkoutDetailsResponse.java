package dev.cristianinbits.hyron.run.dto;

import java.util.List;

public record RunWorkoutDetailsResponse(
        Long id,
        Long workoutId,
        Integer totalDistance,      // m
        Integer totalDurationSec,   // s
        String averagePace,
        Integer elevationGain,      // m
        String surfaceType,
        String sessionType,
        List<RunIntervalResponse> intervals,
        List<RunSplitResponse> splits
) {}
