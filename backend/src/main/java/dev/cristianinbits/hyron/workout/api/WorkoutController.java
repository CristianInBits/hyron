package dev.cristianinbits.hyron.workout.api;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.format.annotation.DateTimeFormat;

import dev.cristianinbits.hyron.exception.BadRequestException;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutCreateRequest;
import dev.cristianinbits.hyron.workout.dto.WorkoutDetailResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutUpdateRequest;
import dev.cristianinbits.hyron.workout.service.WorkoutService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
@Validated
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkoutDetailResponse createWorkout(@Valid @RequestBody WorkoutCreateRequest request) {
        return workoutService.createWorkout(request);
    }

    @GetMapping("/{id}")
    public WorkoutDetailResponse getWorkoutById(@PathVariable @Positive Long id) {
        return workoutService.getWorkoutById(id);
    }
    
    /**
     * List workouts for a given user, optionally filtered by type and/or date
     * range.
     *
     * Examples:
     * GET /api/workouts?userId=1
     * GET /api/workouts?userId=1&type=RUN
     * GET /api/workouts?userId=1&start=2025-01-01T00:00:00&end=2025-01-31T23:59:59
     */
    @GetMapping
    public List<WorkoutSummaryResponse> listWorkouts(
            @RequestParam @Positive Long userId,
            @RequestParam(required = false) WorkoutType type,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end
    ) {

        if ((start != null && end == null) || (start == null && end != null)) {
            throw new BadRequestException("Both 'start' and 'end' must be provided together");
        }

        if (start != null && end != null && !end.isAfter(start)) {
            throw new BadRequestException("'end' must be after 'start'");
        }
        
        if (start != null && end != null) {
            return workoutService.getWorkoutsByUserAndDateRange(userId, start, end);
        }

        if (type != null) {
            return workoutService.getWorkoutsByUserAndType(userId, type);
        }

        return workoutService.getWorkoutsByUser(userId);
    }

    @PatchMapping("/{id}")
    public WorkoutDetailResponse updateWorkout(
        @PathVariable @Positive Long id,
        @Valid @RequestBody WorkoutUpdateRequest request
    ) {
        return workoutService.updateWorkout(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWorkout(@PathVariable @Positive Long id) {
        workoutService.deleteWorkout(id);
    }
}
