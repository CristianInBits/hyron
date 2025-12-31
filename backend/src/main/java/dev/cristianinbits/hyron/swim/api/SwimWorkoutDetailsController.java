package dev.cristianinbits.hyron.swim.api;

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

import dev.cristianinbits.hyron.swim.dto.SwimDetailsCreateRequest;
import dev.cristianinbits.hyron.swim.dto.SwimDetailsResponse;
import dev.cristianinbits.hyron.swim.service.SwimWorkoutDetailsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{userId}/workouts/{workoutId}/swim")
@RequiredArgsConstructor
@Validated
public class SwimWorkoutDetailsController {

    private final SwimWorkoutDetailsService swimService;

    @PutMapping
    public SwimDetailsResponse saveDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId,
            @Valid @RequestBody SwimDetailsCreateRequest request
    ) {
        return swimService.saveDetails(userId, workoutId, request);
    }

    @GetMapping
    public SwimDetailsResponse getDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId
    ) {
        return swimService.getDetails(userId, workoutId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId
    ) {
        swimService.deleteDetails(userId, workoutId);
    }
}