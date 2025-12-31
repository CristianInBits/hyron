package dev.cristianinbits.hyron.gym.service;

import dev.cristianinbits.hyron.gym.dto.GymDetailsCreateRequest;
import dev.cristianinbits.hyron.gym.dto.GymDetailsResponse;

public interface GymWorkoutDetailsService {
    
    public GymDetailsResponse saveDetails(Long userId, Long workoutId, GymDetailsCreateRequest request);

    public GymDetailsResponse getDetails(Long userId, Long workoutId);

    public void deleteDetails(Long userId, Long workoutId);
}