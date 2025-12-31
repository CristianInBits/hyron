package dev.cristianinbits.hyron.gym.api;

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

import dev.cristianinbits.hyron.gym.dto.GymDetailsCreateRequest;
import dev.cristianinbits.hyron.gym.dto.GymDetailsResponse;
import dev.cristianinbits.hyron.gym.service.GymWorkoutDetailsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{userId}/workouts/{workoutId}/gym")
@RequiredArgsConstructor
@Validated
public class GymWorkoutDetailsController {

    private final GymWorkoutDetailsService gymService;

    @PutMapping
    public GymDetailsResponse saveDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId,
            @Valid @RequestBody GymDetailsCreateRequest request
    ) {
        return gymService.saveDetails(userId, workoutId, request);
    }

    @GetMapping
    public GymDetailsResponse getDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId
    ) {
        return gymService.getDetails(userId, workoutId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId
    ) {
        gymService.deleteDetails(userId, workoutId);
    }
}