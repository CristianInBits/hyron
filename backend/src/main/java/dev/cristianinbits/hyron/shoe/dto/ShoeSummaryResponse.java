package dev.cristianinbits.hyron.shoe.dto;

public record ShoeSummaryResponse(
        Long id,
        String brand,
        String model,
        String nickname
) { }