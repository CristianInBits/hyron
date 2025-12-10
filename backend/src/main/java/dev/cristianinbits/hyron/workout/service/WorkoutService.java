package dev.cristianinbits.hyron.workout.service;

import java.time.LocalDateTime;
import java.util.List;

import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutCreateRequest;
import dev.cristianinbits.hyron.workout.dto.WorkoutDetailResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutUpdateRequest;

public interface WorkoutService {
    
    WorkoutDetailResponse createWorkout(WorkoutCreateRequest request);

    WorkoutDetailResponse getWorkoutById(Long id);

    List<WorkoutSummaryResponse> getWorkoutsByUser(Long userId);

    List<WorkoutSummaryResponse> getWorkoutsByUserAndType(Long userId, WorkoutType type);

    List<WorkoutSummaryResponse> getWorkoutsByUserAndDateRange(Long userId, LocalDateTime start, LocalDateTime end);

    WorkoutDetailResponse updateWorkout (Long id, WorkoutUpdateRequest request);

    void deleteWorkout(Long id);
}
