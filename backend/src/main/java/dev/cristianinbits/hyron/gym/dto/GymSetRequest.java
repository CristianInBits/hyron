package dev.cristianinbits.hyron.gym.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record GymSetRequest(

    @NotNull
    @Min(1)
    Integer setNumber,

    @Positive
    Integer reps,

    @PositiveOrZero
    Float weight,

    @Min(1)
    @Max(10)
    Integer rpe,

    @PositiveOrZero
    Integer restAfterSetSec,

    @NotNull
    Boolean completed

) {}
