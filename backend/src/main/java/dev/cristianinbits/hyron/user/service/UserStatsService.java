package dev.cristianinbits.hyron.user.service;

import dev.cristianinbits.hyron.user.dto.UserStatsResponse;

public interface UserStatsService {
    UserStatsResponse getStats(Long userId);
}