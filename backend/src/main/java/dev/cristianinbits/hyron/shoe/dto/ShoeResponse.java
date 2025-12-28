package dev.cristianinbits.hyron.shoe.dto;

public record ShoeResponse(
        Long id,
        String brand,
        String model,
        String nickname,
        boolean active,
        Integer initialDistanceMeters,
        Integer maxDistanceMeters,
        Long totalDistanceMeters,
        Integer percentageUsed
) { }