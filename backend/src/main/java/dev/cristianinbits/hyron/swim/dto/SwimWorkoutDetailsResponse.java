package dev.cristianinbits.hyron.swim.dto;

import java.util.List;

import dev.cristianinbits.hyron.swim.domain.SwimSet;
import dev.cristianinbits.hyron.swim.domain.SwimStroke;

public record SwimWorkoutDetailsResponse(

    Long id,
    Integer totalDistance,
    Integer totalDurationSec,
    String averagePace,
    SwimStroke mainStroke,
    String sessionType,
    List<SwimSet> sets

) { }