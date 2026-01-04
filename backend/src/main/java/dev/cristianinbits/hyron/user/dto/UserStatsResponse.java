package dev.cristianinbits.hyron.user.dto;

import java.util.List;
import java.util.Map;

import dev.cristianinbits.hyron.shoe.dto.ShoeStatsResponse;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;

public record UserStatsResponse(

    Integer totalWorkouts,

    Integer workoutsThisWeek,
    Integer totalDurationSecondsThisWeek,
    Integer totalDistanceMetersThisWeek,
    
    Integer workoutsThisMonth,
    Integer totalDurationSecondsThisMonth,
    Integer totalDistanceMetersThisMonth,
    
    Map<WorkoutType, Integer> workoutsByTypeThisWeek,

    WorkoutSummaryResponse lastWorkout,

    List<ShoeStatsResponse> topShoes
) {}

