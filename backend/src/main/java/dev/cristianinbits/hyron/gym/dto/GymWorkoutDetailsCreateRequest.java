package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;
import edu.umd.cs.findbugs.annotations.NonNull;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record GymWorkoutDetailsCreateRequest(

    @NotNull
    @Positive
    Long workoutId,

    @NotBlank
    @Size(max = 255)
    String goal,

    @NonNull
    MuscleGroup mainMuscleGroup,

    @PositiveOrZero
    Integer totalVolume,

    @NotNull
    @Size(min = 1)
    List<@Valid GymExerciseEntryRequest> exercises

) {}
