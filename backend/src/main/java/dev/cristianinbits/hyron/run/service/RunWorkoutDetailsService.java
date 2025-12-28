package dev.cristianinbits.hyron.run.service;

import dev.cristianinbits.hyron.run.dto.RunDetailsCreateRequest;
import dev.cristianinbits.hyron.run.dto.RunDetailsResponse;

public interface RunWorkoutDetailsService {
    public RunDetailsResponse saveDetails(Long userId, Long workoutId, RunDetailsCreateRequest request);

    public RunDetailsResponse getDetails(Long userId, Long workoutId);

    public void deleteDetails(Long userId, Long workoutId);
}