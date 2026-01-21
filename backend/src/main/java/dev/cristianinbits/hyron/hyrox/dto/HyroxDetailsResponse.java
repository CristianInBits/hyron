package dev.cristianinbits.hyron.hyrox.dto;

import java.util.List;

import dev.cristianinbits.hyron.shoe.dto.ShoeResponse;

public record HyroxDetailsResponse(
    Long id,
    Long workoutId,
    ShoeResponse shoe,
    String notes,
    List<HyroxBlockResponse> blocks
) { }