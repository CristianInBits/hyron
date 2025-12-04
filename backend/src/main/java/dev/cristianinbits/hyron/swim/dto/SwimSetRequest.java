package dev.cristianinbits.hyron.swim.dto;

import dev.cristianinbits.hyron.swim.domain.SwimStroke;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record SwimSetRequest(

    @NotNull
    @Min(0)
    Integer orderIndex,

    @Positive
    Integer repetitions,

    @Positive
    Integer distancePerRep,

    @Size(max = 20)
    String targetPace,

    @PositiveOrZero
    Integer totalBlockTimeSec,

    @PositiveOrZero
    Integer restBetweenRepsSec,

    @Size(max = 2000)
    String notes,

    @NotNull
    SwimStroke stroke

) {}
