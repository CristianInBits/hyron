package dev.cristianinbits.hyron.shoe.dto;

public record ShoeStatsResponse(
    Long id,
    String brand,
    String model,
    String nickname,
    Integer totalDistanceMeters,
    Integer maxDistanceMeters,
    Double percentageUsed
) { }