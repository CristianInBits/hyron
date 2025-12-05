package dev.cristianinbits.hyron.run.service;

import dev.cristianinbits.hyron.run.dto.RunWorkoutDetailsCreateRequest;
import dev.cristianinbits.hyron.run.dto.RunWorkoutDetailsResponse;
import dev.cristianinbits.hyron.run.dto.RunWorkoutDetailsUpdateRequest;

public interface RunService {
    
    RunWorkoutDetailsResponse createOrReplaceRunDetails(RunWorkoutDetailsCreateRequest request);

    RunWorkoutDetailsResponse getRunDetailsByWorkoutId(Long workoutId);

    RunWorkoutDetailsResponse updateRunDetails(Long workoutId, RunWorkoutDetailsUpdateRequest request);

    void deleteRunDetailsByWorkoutId(Long workoutId);
}
