package dev.cristianinbits.hyron.exercise.service;

import java.util.List;

import dev.cristianinbits.hyron.exercise.dto.ExerciseCreateRequest;
import dev.cristianinbits.hyron.exercise.dto.ExerciseResponse;
import dev.cristianinbits.hyron.exercise.dto.ExerciseSummaryResponse;
import dev.cristianinbits.hyron.exercise.dto.ExerciseUpdateRequest;
import dev.cristianinbits.hyron.gym.domain.MuscleGroup;

public interface ExerciseService {
    ExerciseResponse createExercise(Long userId, ExerciseCreateRequest request);
    ExerciseResponse getExercise(Long userId, Long exerciseId);
    List<ExerciseResponse> getAllExercises(Long userId);
    List<ExerciseSummaryResponse> getActiveExercises(Long userId);
    List<ExerciseSummaryResponse> getActiveExercisesByMuscleGroup(Long userId, MuscleGroup muscleGroup);
    ExerciseResponse updateExercise(Long userId, Long exerciseId, ExerciseUpdateRequest request);
    void deleteExercise(Long userId, Long exerciseId);
}