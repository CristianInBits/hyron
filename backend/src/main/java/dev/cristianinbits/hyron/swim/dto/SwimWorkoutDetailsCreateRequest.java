package dev.cristianinbits.hyron.swim.dto;

import java.util.List;

import dev.cristianinbits.hyron.swim.domain.SwimStroke;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record SwimWorkoutDetailsCreateRequest(

    @NotNull
    @Positive
    Long workoutId,

    @PositiveOrZero
    Integer totalDistance,

    @Positive
    Integer totalDurationSec,

    @Size(max = 20)
    String averagePace,

    @NotNull
    SwimStroke mainStroke,

    @Size(max = 20)
    String sessionType,

    @NotNull
    @Size(min = 1)
    List<@Valid SwimSetRequest> sets

) {}
