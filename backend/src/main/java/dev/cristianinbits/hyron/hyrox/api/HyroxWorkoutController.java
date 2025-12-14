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

import dev.cristianinbits.hyron.hyrox.dto.request.HyroxWorkoutDetailsUpsertRequest;
import dev.cristianinbits.hyron.hyrox.dto.response.HyroxWorkoutDetailsResponse;
import dev.cristianinbits.hyron.hyrox.service.HyroxWorkoutService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workouts/{workoutId}/hyrox")
@RequiredArgsConstructor
@Validated
public class HyroxWorkoutController {

    private final HyroxWorkoutService hyroxWorkoutService;

    /**
     * Creates or completely replaces the Hyrox workout details for the given workout.
     *
     * PUT semantics: the resource (/workouts/{id}/hyrox) will match exactly the payload sent.
     */
    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public HyroxWorkoutDetailsResponse upsertHyroxDetails(
            @PathVariable @Positive Long workoutId,
            @Valid @RequestBody HyroxWorkoutDetailsUpsertRequest request
    ) {
        return hyroxWorkoutService.createOrReplaceHyroxDetails(workoutId, request);
    }

    /**
     * Returns the Hyrox workout details for the given workout id.
     */
    @GetMapping
    public HyroxWorkoutDetailsResponse getHyroxDetails(
            @PathVariable @Positive Long workoutId
    ) {
        return hyroxWorkoutService.getHyroxDetailsByWorkoutId(workoutId);
    }

    /**
     * Deletes the Hyrox workout details for the given workout id.
     */
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHyroxDetails(
            @PathVariable @Positive Long workoutId
    ) {
        hyroxWorkoutService.deleteHyroxDetailsByWorkoutId(workoutId);
    }
}





