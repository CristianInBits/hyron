package dev.cristianinbits.hyron.hyrox.dto;

import java.util.List;

public record HyroxBlockResponse(
    Long id,
    Integer orderIndex,
    Integer restDurationSeconds,
    String notes,
    List<HyroxItemResponse> items
) { }