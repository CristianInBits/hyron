package dev.cristianinbits.hyron.workout.service;

import java.time.Instant;

import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutCreateRequest;
import dev.cristianinbits.hyron.workout.dto.WorkoutDetailResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutUpdateRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Business operations for workout management.
 */
public interface WorkoutService {

    WorkoutDetailResponse createWorkout(Long userId, WorkoutCreateRequest request);

    WorkoutDetailResponse getWorkoutById(Long userId, Long workoutId);

    Page<WorkoutSummaryResponse> getWorkouts(
            Long userId,
            WorkoutType type,
            Instant start,
            Instant end,
            Pageable pageable
    );

    WorkoutDetailResponse updateWorkout(Long userId, Long workoutId, WorkoutUpdateRequest request);

    void deleteWorkout(Long userId, Long workoutId);
}