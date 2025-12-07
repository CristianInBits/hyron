package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GymExerciseEntryRequest(

    @NotNull
    @Min(0)
    Integer orderIndex,

    @NotBlank
    @Size(max = 100)
    String exerciseName,

    @Size(max = 1000)
    String notes,

    @NotNull
    MuscleGroup muscleGroup,

    @NotNull
    @Size(min = 1)
    List<@Valid GymSetRequest> sets

) {}
