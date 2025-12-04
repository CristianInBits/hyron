package dev.cristianinbits.hyron.workout.dto;

import java.time.LocalDateTime;

import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import edu.umd.cs.findbugs.annotations.NonNull;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record WorkoutUpdateRequest(

    @NotNull
    WorkoutType type,

    @NonNull
    LocalDateTime starDateTime,

    LocalDateTime enDateTime,

    @Min(1)
    @Max(10)
    Integer globalRpe,

    @Size(max = 4000)
    String notes,

    @Size(max = 255)
    String location,

    @Size(max = 255)
    String source
) { }
