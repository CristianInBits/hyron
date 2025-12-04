package dev.cristianinbits.hyron.hyrox.dto.response;

public record HyroxRunSegmentResponse(
        Long id,
        Integer distance,         // m
        Integer durationSec,      // s
        String averagePace,       // "4:30/km"
        Integer averageHr,
        String notes
) { }