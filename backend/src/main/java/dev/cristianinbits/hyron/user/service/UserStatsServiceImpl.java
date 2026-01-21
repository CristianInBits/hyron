package dev.cristianinbits.hyron.user.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;
import dev.cristianinbits.hyron.user.dto.UserStatsResponse;
import dev.cristianinbits.hyron.user.repo.UserRepository;
import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserStatsServiceImpl implements UserStatsService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;

    @Override
    public UserStatsResponse getStats(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found with id " + userId);
        }

        ZoneId zone = ZoneId.of("Europe/Madrid");
        LocalDate today = LocalDate.now(zone);

        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        Instant startOfWeekInstant = startOfWeek.atStartOfDay(zone).toInstant();

        LocalDate startOfMonth = today.withDayOfMonth(1);
        Instant startOfMonthInstant = startOfMonth.atStartOfDay(zone).toInstant();

        long totalWorkouts = workoutRepository.countByUserId(userId);
        long totalDurationSeconds = workoutRepository.sumTotalDurationSeconds(userId);
        long totalRunDistanceMeters = calculateTotalRunDistance(userId, null);
        long totalSwimDistanceMeters = workoutRepository.sumSwimDistanceByUserId(userId);

        long workoutsThisWeekCount = workoutRepository.countByUserIdAndStartDateTimeGreaterThanEqual(userId,
                startOfWeekInstant);
        long totalDurationSecondsThisWeek = workoutRepository
                .sumTotalDurationSecondsSince(userId, startOfWeekInstant);
        long totalRunDistanceMetersThisWeek = calculateTotalRunDistance(userId, startOfWeekInstant);
        long totalSwimDistanceMetersThisWeek = workoutRepository.sumSwimDistanceByUserIdSince(userId,
                startOfWeekInstant);

        Map<WorkoutType, Integer> workoutsByTypeThisWeek = getWorkoutsByTypeMap(userId, startOfWeekInstant);

        long workoutsThisMonthCount = workoutRepository.countByUserIdAndStartDateTimeGreaterThanEqual(userId,
                startOfMonthInstant);
        long totalDurationSecondsThisMonth = workoutRepository.sumTotalDurationSecondsSince(userId,
                startOfMonthInstant);
        long totalRunDistanceMetersThisMonth = calculateTotalRunDistance(userId, startOfMonthInstant);
        long totalSwimDistanceMetersThisMonth = workoutRepository.sumSwimDistanceByUserIdSince(userId,
                startOfMonthInstant);

        WorkoutSummaryResponse lastWorkout = workoutRepository
                .findFirstByUserIdOrderByStartDateTimeDesc(userId)
                .map(this::toSummaryResponse)
                .orElse(null);

        return new UserStatsResponse(
                totalWorkouts,
                totalDurationSeconds,
                totalRunDistanceMeters,
                totalSwimDistanceMeters,
                workoutsThisWeekCount,
                totalDurationSecondsThisWeek,
                totalRunDistanceMetersThisWeek,
                totalSwimDistanceMetersThisWeek,
                workoutsThisMonthCount,
                totalDurationSecondsThisMonth,
                totalRunDistanceMetersThisMonth,
                totalSwimDistanceMetersThisMonth,
                workoutsByTypeThisWeek,
                lastWorkout);
    }

    private long calculateTotalRunDistance(Long userId, Instant since) {
        long runDist = (since == null)
                ? workoutRepository.sumRunDistanceByUserId(userId)
                : workoutRepository.sumRunDistanceByUserIdSince(userId, since);

        long hyroxDist = (since == null)
                ? workoutRepository.sumHyroxDistanceByUserIdAndStation(userId, HyroxStation.RUN)
                : workoutRepository.sumHyroxDistanceByUserIdAndStationSince(userId, HyroxStation.RUN, since);

        return runDist + hyroxDist;
    }

    private Map<WorkoutType, Integer> getWorkoutsByTypeMap(Long userId, Instant since) {
        List<Object[]> results = workoutRepository.countWorkoutsByTypeSince(userId, since);
        Map<WorkoutType, Integer> map = new EnumMap<>(WorkoutType.class);
        for (WorkoutType t : WorkoutType.values())
            map.put(t, 0);
        for (Object[] row : results) {
            map.put((WorkoutType) row[0], ((Long) row[1]).intValue());
        }
        return map;
    }

    private WorkoutSummaryResponse toSummaryResponse(Workout workout) {
        return new WorkoutSummaryResponse(
                workout.getId(),
                workout.getType(),
                workout.getStartDateTime(),
                workout.getEndDateTime(),
                workout.getGlobalRpe(),
                workout.getLocation());
    }
}