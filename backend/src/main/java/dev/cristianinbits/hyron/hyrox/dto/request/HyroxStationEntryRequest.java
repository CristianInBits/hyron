package dev.cristianinbits.hyron.hyrox.dto.request;

import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record HyroxStationEntryRequest(
    
    @NotNull
    HyroxStation station,

    @NotNull
    @Positive
    Integer durationSec,

    @Min(1)
    @Max(10)
    Integer rpe,

    @Positive
    Integer reps,

    @Positive
    Integer distance,

    @Positive
    Float totalWeight,

    @Positive
    Integer averagePower,

    @Positive
    @Max(250)
    Integer averageHr,

    @Size(max = 2000)
    String notes

) {}
