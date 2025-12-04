package dev.cristianinbits.hyron.run.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record RunIntervalRequest(

        @NotBlank
        String type,  // "WORK", "REST", "WARMUP", "COOLDOWN"

        @NotNull
        @Min(0)
        Integer orderIndex,

        @PositiveOrZero
        Integer distance,  // m

        @PositiveOrZero
        Integer durationSec,  // s (plan)

        @PositiveOrZero
        Integer timeSec,  // s (real)

        @Size(max = 20)
        String averagePace,

        @PositiveOrZero
        @Max(250)
        Integer averageHr,

        @Min(1)
        @Max(10)
        Integer rpe,

        @Size(max = 2000)
        String notes
) {}
