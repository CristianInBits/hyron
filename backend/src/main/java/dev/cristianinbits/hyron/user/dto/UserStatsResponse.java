package dev.cristianinbits.hyron.user.dto;

import java.util.List;
import java.util.Map;

import dev.cristianinbits.hyron.shoe.dto.ShoeStatsResponse;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;

public record UserStatsResponse(
        Long totalWorkouts,
        Long totalDurationSeconds,
        Long totalRunDistanceMeters,
        Long totalSwimDistanceMeters,
        Long workoutsThisWeek,
        Long totalDurationSecondsThisWeek,
        Long totalRunDistanceMetersThisWeek,
        Long totalSwimDistanceMetersThisWeek,
        Long workoutsThisMonth,
        Long totalDurationSecondsThisMonth,
        Long totalRunDistanceMetersThisMonth,
        Long totalSwimDistanceMetersThisMonth,
        Map<WorkoutType, Integer> workoutsByTypeThisWeek,
        WorkoutSummaryResponse lastWorkout,
        List<ShoeStatsResponse> topShoes
) {}