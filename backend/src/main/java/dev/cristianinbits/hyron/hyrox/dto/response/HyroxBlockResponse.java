package dev.cristianinbits.hyron.hyrox.dto.response;

import java.util.List;

public record HyroxBlockResponse(
        Long id,
        Integer orderIndex,
        Integer restBeforeBlockSec,
        Integer restAfterBlockSec,
        String notes,
        List<HyroxBlockItemResponse> items
) { }