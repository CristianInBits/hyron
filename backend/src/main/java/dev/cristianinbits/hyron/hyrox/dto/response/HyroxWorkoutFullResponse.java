package dev.cristianinbits.hyron.hyrox.dto.response;

import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;

public record HyroxWorkoutFullResponse(
        WorkoutSummaryResponse workout,
        HyroxWorkoutDetailsResponse hyroxDetails
) { }