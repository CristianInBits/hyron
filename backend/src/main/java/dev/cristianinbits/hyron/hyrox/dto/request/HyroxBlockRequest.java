package dev.cristianinbits.hyron.hyrox.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record HyroxBlockRequest(

    @NotNull
    @Positive
    Integer orderIndex,

    @PositiveOrZero
    Integer restBeforeBlockSec,

    @PositiveOrZero
    Integer restAfterBlockSec,

    @Size(max = 2000)
    String notes,

    @NotNull
    @Size(min = 1)
    List<@NotNull @Valid HyroxBlockItemRequest> items

) { }
