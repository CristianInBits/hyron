package dev.cristianinbits.hyron.hyrox.service;

import dev.cristianinbits.hyron.hyrox.dto.HyroxDetailsCreateRequest;
import dev.cristianinbits.hyron.hyrox.dto.HyroxDetailsResponse;

public interface HyroxService {
    HyroxDetailsResponse createOrUpdateDetails(Long userId, Long workoutId, HyroxDetailsCreateRequest request);

    HyroxDetailsResponse getDetails(Long userId, Long workoutId);

    void deleteDetails(Long userId, Long workoutId);
}