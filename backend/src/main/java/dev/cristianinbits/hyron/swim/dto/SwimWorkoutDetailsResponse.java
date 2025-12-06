package dev.cristianinbits.hyron.swim.dto;

import java.util.List;

import dev.cristianinbits.hyron.swim.domain.SwimStroke;

public record SwimWorkoutDetailsResponse(

    Long id,
    Long workoutId,
    Integer totalDistance,
    Integer totalDurationSec,
    String averagePace,
    SwimStroke mainStroke,
    String sessionType,
    List<SwimSetResponse> sets

) { }