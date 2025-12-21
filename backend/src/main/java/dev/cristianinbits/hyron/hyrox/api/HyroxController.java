package dev.cristianinbits.hyron.hyrox.api;

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

import dev.cristianinbits.hyron.hyrox.dto.HyroxDetailsCreateRequest;
import dev.cristianinbits.hyron.hyrox.dto.HyroxDetailsResponse;
import dev.cristianinbits.hyron.hyrox.service.HyroxService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{userId}/workouts/{workoutId}/hyrox")
@RequiredArgsConstructor
@Validated
public class HyroxController {

    private final HyroxService hyroxService;

    @PutMapping
    public HyroxDetailsResponse createOrUpdateDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId,
            @Valid @RequestBody HyroxDetailsCreateRequest request
    ) {
        return hyroxService.createOrUpdateDetails(userId, workoutId, request);
    }

    @GetMapping
    public HyroxDetailsResponse getDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId
    ) {
        return hyroxService.getDetails(userId, workoutId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDetails(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long workoutId
    ) {
        hyroxService.deleteDetails(userId, workoutId);
    }
}