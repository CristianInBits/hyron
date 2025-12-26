package dev.cristianinbits.hyron.hyrox.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record HyroxBlockRequest(

    @PositiveOrZero
    Integer restDurationSeconds,

    @Size(max = 4000)
    String notes,

    @NotEmpty(message = "Block must contain at least one item")
    @Valid
    List<HyroxItemRequest> items

) { }
