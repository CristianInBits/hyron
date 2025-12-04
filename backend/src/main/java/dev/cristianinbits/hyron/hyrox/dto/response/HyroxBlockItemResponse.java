package dev.cristianinbits.hyron.hyrox.dto.response;

import dev.cristianinbits.hyron.hyrox.domain.ItemType;

public record HyroxBlockItemResponse(
        Long id,
        Integer orderIndex,
        ItemType itemType,
        Integer restBeforeItemSec,
        Integer restAfterItemSec,
        HyroxRunSegmentResponse runSegment,
        HyroxStationEntryResponse stationEntry
) { }