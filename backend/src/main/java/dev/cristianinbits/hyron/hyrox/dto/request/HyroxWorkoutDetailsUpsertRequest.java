package dev.cristianinbits.hyron.hyrox.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record HyroxWorkoutDetailsUpsertRequest(
        
        @Size(max = 50)
        String format,

        @Size(max = 4000)
        String strategyNotes,

        @NotNull
        @Size(min = 1)
        List<@NotNull @Valid HyroxBlockRequest> blocks
) { }
