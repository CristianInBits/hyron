package dev.cristianinbits.hyron.hyrox.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record HyroxWorkoutDetailsCreateRequest(

    @NotNull
    @Positive
    Long workoutId,

    @Size(max = 50)
    String format,  // "FULL", "HALF", ...

    @Size(max = 4000)
    String strategyNotes,

    @NotNull
    @Size(min = 1)
    List<@NotNull HyroxBlockRequest> blocks

) { }
