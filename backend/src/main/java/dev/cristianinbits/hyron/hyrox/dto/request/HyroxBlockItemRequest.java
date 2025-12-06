package dev.cristianinbits.hyron.hyrox.dto.request;

import dev.cristianinbits.hyron.hyrox.domain.ItemType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record HyroxBlockItemRequest(

    @NotNull
    ItemType itemType,

    @NotNull
    @Positive
    Integer orderIndex,

    @PositiveOrZero
    Integer restBeforeItemSec,

    @PositiveOrZero
    Integer restAfterItemSec,

    @Valid HyroxRunSegmentRequest runSegment,
    @Valid HyroxStationEntryRequest stationEntry

) { }
