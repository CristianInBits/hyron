package dev.cristianinbits.hyron.hyrox.dto;

import java.util.List;

import dev.cristianinbits.hyron.shoe.dto.ShoeSummaryResponse;

public record HyroxDetailsResponse(
    Long id,
    Long workoutId,
    ShoeSummaryResponse shoe,
    String notes,
    List<HyroxBlockResponse> blocks
) { }