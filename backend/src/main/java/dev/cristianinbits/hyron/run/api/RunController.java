package dev.cristianinbits.hyron.run.api;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import dev.cristianinbits.hyron.run.dto.RunDetailsCreateRequest;
import dev.cristianinbits.hyron.run.dto.RunDetailsResponse;
import dev.cristianinbits.hyron.run.service.RunWorkoutDetailsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{userId}/workouts/{workoutId}/run")
@RequiredArgsConstructor
@Validated
public class RunController {

    private final RunWorkoutDetailsService runService;

    @PutMapping
    public RunDetailsResponse saveDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId,
            @Valid @RequestBody RunDetailsCreateRequest request) {
        return runService.saveDetails(userId, workoutId, request);
    }

    @GetMapping
    public RunDetailsResponse getDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId) {
        return runService.getDetails(userId, workoutId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId) {
        runService.deleteDetails(userId, workoutId);
    }
}