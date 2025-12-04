package dev.cristianinbits.hyron.gym.dto;

import java.util.List;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;

public record GymExerciseEntryResponse(

    Long id,
    Integer orderIndex,
    String exerciseName,
    String techniqueNotes,
    MuscleGroup muscleGroup,
    List<GymSetResponse> sets

) {}
