package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;
import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;

public record GymWorkoutDetailsUpdateRequest(

    String goal,
    
    MuscleGroup mainMuscleGroup,

    @PositiveOrZero
    Integer totalVolume,

    List<@Valid GymExerciseEntryRequest> exercises

) {}
