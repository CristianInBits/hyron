package dev.cristianinbits.hyron.swim.dto;

import java.util.List;

import dev.cristianinbits.hyron.swim.domain.SwimStroke;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

public record SwimWorkoutDetailsUpdateRequest(

    @Positive
    Integer totalDistance,

    @Positive
    Integer totalDurationSec,

    String averagePace,

    SwimStroke mainStroke,

    String sessionType,

    List<@Valid SwimSetRequest> sets

) { }
