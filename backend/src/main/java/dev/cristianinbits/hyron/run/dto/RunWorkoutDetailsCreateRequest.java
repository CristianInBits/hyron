package dev.cristianinbits.hyron.run.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RunWorkoutDetailsCreateRequest(

        @NotNull
        @Positive
        Long workoutId,           // o fuera, en la ruta

        @PositiveOrZero
        Integer totalDistance,    // m
        
        @PositiveOrZero
        Integer totalDurationSec, // s

        @Size(max = 20)
        String averagePace,
        
        @PositiveOrZero
        Integer elevationGain,    // m
        
        @Size(max = 20)
        String surfaceType,
        
        @Size(max = 50)
        String sessionType,

        List<@Valid RunIntervalRequest> intervals,

        List<@Valid RunSplitRequest> splits
) {
}
