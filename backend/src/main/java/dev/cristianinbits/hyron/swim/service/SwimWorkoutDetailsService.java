package dev.cristianinbits.hyron.swim.service;

import dev.cristianinbits.hyron.swim.dto.SwimDetailsCreateRequest;
import dev.cristianinbits.hyron.swim.dto.SwimDetailsResponse;

public interface SwimWorkoutDetailsService {
    SwimDetailsResponse saveDetails(Long userId, Long workoutId, SwimDetailsCreateRequest request);
    SwimDetailsResponse getDetails(Long userId, Long workoutId);
    void deleteDetails(Long userId, Long workoutId);
}