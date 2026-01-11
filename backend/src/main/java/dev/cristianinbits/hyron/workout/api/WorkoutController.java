package dev.cristianinbits.hyron.workout.api;

import java.net.URI;
import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

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
@RequestMapping("/api/users/{userId}/workouts")
@RequiredArgsConstructor
@Validated
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutDetailResponse> createWorkout(
            @PathVariable @Positive Long userId,
            @Valid @RequestBody WorkoutCreateRequest request
    ) {
        WorkoutDetailResponse created = workoutService.createWorkout(userId, request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }


    @GetMapping("/{id}")
    public WorkoutDetailResponse getWorkoutById(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id
    ) {
        return workoutService.getWorkoutById(userId, id);
    }

    @GetMapping
    public Page<WorkoutSummaryResponse> listWorkouts(
            @PathVariable @Positive Long userId,
            @RequestParam(required = false) WorkoutType type,
            @RequestParam(required = false) Instant start,
            @RequestParam(required = false) Instant end,
            @PageableDefault(size = 20, sort = "startDateTime", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return workoutService.getWorkouts(userId, type, start, end, pageable);
    }

    @PatchMapping("/{id}")
    public WorkoutDetailResponse updateWorkout(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id,
            @Valid @RequestBody WorkoutUpdateRequest request
    ) {
        return workoutService.updateWorkout(userId, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWorkout(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id
    ) {
        workoutService.deleteWorkout(userId, id);
    }
}