package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;

public record GymWorkoutDetailsResponse(

    Long id,
    Long workoutId,
    String goal,
    MuscleGroup mainMuscleGroup,
    Integer totalVolume,
    List<GymExerciseEntryResponse> exercises

) {}
