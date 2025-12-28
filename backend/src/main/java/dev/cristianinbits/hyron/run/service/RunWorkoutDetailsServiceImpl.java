package dev.cristianinbits.hyron.run.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.ConflictException;
import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.run.domain.RunInterval;
import dev.cristianinbits.hyron.run.domain.RunWorkoutDetails;
import dev.cristianinbits.hyron.run.dto.RunDetailsCreateRequest;
import dev.cristianinbits.hyron.run.dto.RunDetailsResponse;
import dev.cristianinbits.hyron.run.dto.RunIntervalRequest;
import dev.cristianinbits.hyron.run.dto.RunIntervalResponse;
import dev.cristianinbits.hyron.run.repo.RunWorkoutDetailsRepository;
import dev.cristianinbits.hyron.shoe.domain.Shoe;
import dev.cristianinbits.hyron.shoe.dto.ShoeSummaryResponse;
import dev.cristianinbits.hyron.shoe.repo.ShoeRepository;
import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RunWorkoutDetailsServiceImpl implements RunWorkoutDetailsService {

    private final RunWorkoutDetailsRepository runRepository;
    private final WorkoutRepository workoutRepository;
    private final ShoeRepository shoeRepository;

    @Override
    public RunDetailsResponse saveDetails(Long userId, Long workoutId, RunDetailsCreateRequest request) {
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new NotFoundException("Workout not found"));

        if (workout.getType() != WorkoutType.RUN) {
            throw new ConflictException("Workout type must be RUN but was " + workout.getType());
        }

        RunWorkoutDetails details = runRepository.findByWorkoutId(workoutId)
                .orElseGet(() -> RunWorkoutDetails.builder().workout(workout).build());

        if (request.totalDistanceMeters() != null) {
            details.setTotalDistanceMeters(request.totalDistanceMeters());
        } else {
            details.setTotalDistanceMeters(calculateTotalDistance(request.intervals()));
        }

        if (request.totalElevationGain() != null) {
            details.setTotalElevationGain(request.totalElevationGain());
        } else {
            details.setTotalElevationGain(calculateTotalElevation(request.intervals()));
        }

        details.setAverageHr(request.averageHr());
        details.setNotes(normalizeString(request.notes()));

        if (request.shoeId() != null) {
            Shoe shoe = shoeRepository.findByIdAndUserId(request.shoeId(), userId)
                    .orElseThrow(() -> new NotFoundException("Shoe not found"));
            details.setShoe(shoe);
        } else {
            details.setShoe(null);
        }

        // Full replace + flush
        details.getIntervals().clear();
        runRepository.flush();

        int index = 1;
        for (RunIntervalRequest intervalReq : request.intervals()) {
            details.addInterval(mapInterval(intervalReq, index++));
        }

        RunWorkoutDetails saved = runRepository.save(details);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public RunDetailsResponse getDetails(Long userId, Long workoutId) {
        if (!workoutRepository.existsByIdAndUserId(workoutId, userId)) {
            throw new NotFoundException("Workout not found");
        }

        RunWorkoutDetails details = runRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Run details not found"));

        return toResponse(details);
    }

    @Override
    public void deleteDetails(Long userId, Long workoutId) {
        if (!runRepository.existsByWorkout_IdAndWorkout_User_Id(workoutId, userId)) {
            throw new NotFoundException("Run details not found");
        }
        runRepository.deleteByWorkoutId(workoutId);
    }

    // ==================== Mappers ====================

    private RunInterval mapInterval(RunIntervalRequest request, int index) {
        return RunInterval.builder()
                .orderIndex(index)
                .type(request.type())
                .durationSeconds(request.durationSeconds())
                .distanceMeters(request.distanceMeters())
                .averageHr(request.averageHr())
                .cadenceSpm(request.cadenceSpm())
                .elevationGain(request.elevationGain())
                .notes(normalizeString(request.notes()))
                .build();
    }

    private RunDetailsResponse toResponse(RunWorkoutDetails details) {
        return new RunDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getTotalDistanceMeters(),
                details.getTotalElevationGain(),
                details.getAverageHr(),
                toShoeSummary(details.getShoe()),
                details.getNotes(),
                calculateAveragePace(details),
                details.getIntervals().stream()
                        .map(this::toIntervalResponse)
                        .toList());
    }

    private RunIntervalResponse toIntervalResponse(RunInterval interval) {
        return new RunIntervalResponse(
                interval.getId(),
                interval.getOrderIndex(),
                interval.getType(),
                interval.getDurationSeconds(),
                interval.getDistanceMeters(),
                interval.getAverageHr(),
                interval.getCadenceSpm(),
                interval.getElevationGain(),
                interval.getNotes(),
                calculatePace(interval.getDistanceMeters(), interval.getDurationSeconds()));
    }

    private ShoeSummaryResponse toShoeSummary(Shoe shoe) {
        if (shoe == null) return null;
        return new ShoeSummaryResponse(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getNickname()
        );
    }

    // ==================== Cálculos ====================

    private Integer calculateTotalDistance(List<RunIntervalRequest> intervals) {
        if (intervals == null || intervals.isEmpty())
            return null;
        int total = intervals.stream()
                .map(i -> i.distanceMeters() != null ? i.distanceMeters() : 0)
                .reduce(0, Integer::sum);
        return total > 0 ? total : null;
    }

    private Integer calculateTotalElevation(List<RunIntervalRequest> intervals) {
        if (intervals == null || intervals.isEmpty())
            return null;
        int total = intervals.stream()
                .map(i -> i.elevationGain() != null ? i.elevationGain() : 0)
                .reduce(0, Integer::sum);
        return total > 0 ? total : null;
    }

    private Integer calculateAveragePace(RunWorkoutDetails details) {
        if (details.getTotalDistanceMeters() == null || details.getTotalDistanceMeters() == 0) {
            return null;
        }
        int totalSeconds = details.getIntervals().stream()
                .map(RunInterval::getDurationSeconds)
                .filter(Objects::nonNull)
                .reduce(0, Integer::sum);
        if (totalSeconds == 0)
            return null;
        return (totalSeconds * 1000) / details.getTotalDistanceMeters();
    }

    private Integer calculatePace(Integer distanceMeters, Integer durationSeconds) {
        if (distanceMeters == null || distanceMeters == 0 || durationSeconds == null) {
            return null;
        }
        return (durationSeconds * 1000) / distanceMeters;
    }

    private String normalizeString(String value) {
        return (value != null && !value.isBlank()) ? value.trim() : null;
    }
}