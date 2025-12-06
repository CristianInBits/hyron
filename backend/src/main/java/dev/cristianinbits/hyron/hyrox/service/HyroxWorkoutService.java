package dev.cristianinbits.hyron.hyrox.service;

import dev.cristianinbits.hyron.hyrox.dto.request.HyroxWorkoutDetailsCreateRequest;
import dev.cristianinbits.hyron.hyrox.dto.response.HyroxWorkoutDetailsResponse;

public interface HyroxWorkoutService {
    
    /**
     * Creates or completly replaces the Hyrox workout details for the given workout.
     */
    HyroxWorkoutDetailsResponse createOrReplaceHyroxDetails(HyroxWorkoutDetailsCreateRequest request);

    /**
     * Returns the Hyrox workout details for the given workout id.
     */
    HyroxWorkoutDetailsResponse getHyroxDetailsByWorkoutId(Long workoutId);

    /**
     * Deletes the Hyrox workout details for the given workout id.
     */
    void deleteHyroxDetailsWorkoutById(Long workoutId);
    
}
