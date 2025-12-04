package dev.cristianinbits.hyron.run.dto;

public record RunSplitResponse(
        Long id,
        Integer kilometer,
        Integer timeSec, // s
        String pace, // "5:00/km"
        Integer averageHr
) {}
