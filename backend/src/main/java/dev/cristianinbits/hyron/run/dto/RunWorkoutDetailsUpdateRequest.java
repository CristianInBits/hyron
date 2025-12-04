package dev.cristianinbits.hyron.run.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

public record RunWorkoutDetailsUpdateRequest(

        @Positive
        Integer totalDistance,    // m

        @Positive
        Integer totalDurationSec, // s

        String averagePace,

        @PositiveOrZero
        Integer elevationGain,    // m

        String surfaceType,

        String sessionType,

        List<@Valid RunIntervalRequest> intervals,

        List<@Valid RunSplitRequest> splits
) {
}
