package dev.cristianinbits.hyron.gym.service;

import dev.cristianinbits.hyron.gym.dto.GymWorkoutDetailsCreateRequest;
import dev.cristianinbits.hyron.gym.dto.GymWorkoutDetailsResponse;
import dev.cristianinbits.hyron.gym.dto.GymWorkoutDetailsUpdateRequest;

public interface GymWorkoutService {

    /**
     * Creates or completely replaces the gym workout details for the given workout.
     */
    GymWorkoutDetailsResponse createOrReplaceGymDetails(GymWorkoutDetailsCreateRequest request);

    /**
     * Returns the gym workout details for the given workout id.
     */
    GymWorkoutDetailsResponse getGymDetailsByWorkoutId(Long workoutId);

    /**
     * Updates gym workout details for the given workout id. Fields that are null are ignored.
     */
    GymWorkoutDetailsResponse updateGymDetails(Long workoutId, GymWorkoutDetailsUpdateRequest request);

    /**
     * Deletes the gym workout details for the given workout id.
     */
    void deleteGymDetailsByWorkoutId(Long workoutId);
}
