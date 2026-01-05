package dev.cristianinbits.hyron.hyrox.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record HyroxDetailsCreateRequest(

    @Positive
    Long shoeId,

    @Size(max = 4000)
    String notes,

    @NotEmpty(message = "Must contain at least one block")
    @Valid
    List<HyroxBlockRequest> blocks

) { }