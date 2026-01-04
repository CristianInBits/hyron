package dev.cristianinbits.hyron.user.api;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import dev.cristianinbits.hyron.user.dto.UserStatsResponse;
import dev.cristianinbits.hyron.user.service.UserStatsService;

@RestController
@RequestMapping("/api/users/{userId}/stats")
@RequiredArgsConstructor
@Validated
public class UserStatsController {

    private final UserStatsService userStatsService;

    @GetMapping
    public UserStatsResponse getStats(@PathVariable @Positive Long userId) {
        return userStatsService.getStats(userId);
    }
}