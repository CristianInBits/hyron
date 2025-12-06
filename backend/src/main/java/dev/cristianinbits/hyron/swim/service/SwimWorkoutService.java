package dev.cristianinbits.hyron.swim.service;

import dev.cristianinbits.hyron.swim.dto.SwimWorkoutDetailsCreateRequest;
import dev.cristianinbits.hyron.swim.dto.SwimWorkoutDetailsResponse;
import dev.cristianinbits.hyron.swim.dto.SwimWorkoutDetailsUpdateRequest;

public interface SwimWorkoutService {

    /**
     * Creates or completely replaces the swim workout details for the given workout.
     */
    SwimWorkoutDetailsResponse createOrReplaceSwimDetails(SwimWorkoutDetailsCreateRequest request);

    /**
     * Returns the swim workout details for the given workout id.
     */
    SwimWorkoutDetailsResponse getSwimDetailsByWorkoutId(Long workoutId);

    /**
     * Updates swim workout details for the given workout id. Fields that are null are ignored.
     */
    SwimWorkoutDetailsResponse updateSwimDetails(Long workoutId, SwimWorkoutDetailsUpdateRequest request);

    /**
     * Deletes the swim workout details for the given workout id.
     */
    void deleteSwimDetailsByWorkoutId(Long workoutId);
}
