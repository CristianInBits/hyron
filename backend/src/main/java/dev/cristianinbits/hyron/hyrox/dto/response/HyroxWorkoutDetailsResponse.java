package dev.cristianinbits.hyron.hyrox.dto.response;

import java.util.List;

public record HyroxWorkoutDetailsResponse(
        Long id,
        Long workoutId,
        String format,         // "FULL", "HALF", etc.
        String strategyNotes,
        List<HyroxBlockResponse> blocks
) { }