package dev.cristianinbits.hyron.hyrox.dto;

import java.util.List;

public record HyroxDetailsResponse(
    Long id,
    Long workoutId,
    String notes,
    List<HyroxBlockResponse> blocks
) { }