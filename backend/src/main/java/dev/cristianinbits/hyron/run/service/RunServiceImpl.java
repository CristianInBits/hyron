package dev.cristianinbits.hyron.run.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.exception.NotFoundException;

import dev.cristianinbits.hyron.run.domain.RunInterval;
import dev.cristianinbits.hyron.run.domain.RunSplit;
import dev.cristianinbits.hyron.run.domain.RunWorkoutDetails;
import dev.cristianinbits.hyron.run.dto.RunIntervalRequest;
import dev.cristianinbits.hyron.run.dto.RunIntervalResponse;
import dev.cristianinbits.hyron.run.dto.RunSplitRequest;
import dev.cristianinbits.hyron.run.dto.RunSplitResponse;
import dev.cristianinbits.hyron.run.dto.RunWorkoutDetailsCreateRequest;
import dev.cristianinbits.hyron.run.dto.RunWorkoutDetailsResponse;
import dev.cristianinbits.hyron.run.dto.RunWorkoutDetailsUpdateRequest;
import dev.cristianinbits.hyron.run.repo.RunIntervalRepository;
import dev.cristianinbits.hyron.run.repo.RunSplitRepository;
import dev.cristianinbits.hyron.run.repo.RunWorkoutDetailsRepository;

import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RunServiceImpl implements RunService {

    private final RunSplitRepository runSplitRepository;
    private final RunIntervalRepository runIntervalRepository;
    private final RunWorkoutDetailsRepository runWorkoutDetailsRepository;
    private final WorkoutRepository workoutRepository;

    @Override
    public RunWorkoutDetailsResponse createOrReplaceRunDetails(RunWorkoutDetailsCreateRequest request) {

        Workout workout = workoutRepository.findById(request.workoutId())
                .orElseThrow(() -> new NotFoundException("Workout not found with id " + request.workoutId()));

        runWorkoutDetailsRepository.findByWorkoutId(workout.getId())
                .ifPresent(existing -> runWorkoutDetailsRepository.delete(existing));

        RunWorkoutDetails details = new RunWorkoutDetails();
        details.setWorkout(workout);
        details.setTotalDistance(request.totalDistance());
        details.setTotalDurationSec(request.totalDurationSec());
        details.setAveragePace(request.averagePace());
        details.setElevationGain(request.elevationGain());
        details.setSurfaceType(request.surfaceType());
        details.setSessionType(request.sessionType());

        List<RunInterval> intervals = new ArrayList<>();
        if (request.intervals() != null) {
            for (RunIntervalRequest intervalRequest : request.intervals()) {
                RunInterval interval = toIntervalEntity(intervalRequest, details);
                intervals.add(interval);
            }
        }
        details.setIntervals(intervals);

        List<RunSplit> splits = new ArrayList<>();
        if (request.splits() != null) {
            for (RunSplitRequest splitRequest : request.splits()) {
                RunSplit split = toSplitEntity(splitRequest, details);
                splits.add(split);
            }
        }
        details.setSplits(splits);

        RunWorkoutDetails saved = runWorkoutDetailsRepository.save(details);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public RunWorkoutDetailsResponse getRunDetailsByWorkoutId(Long workoutId) {

        RunWorkoutDetails details = runWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Run details not found for workout id " + workoutId));

        return toResponse(details);
    }

    @Override
    public RunWorkoutDetailsResponse updateRunDetails(Long workoutId, RunWorkoutDetailsUpdateRequest request) {

        RunWorkoutDetails details = runWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Run details not found for workout id " + workoutId));

        if (request.totalDistance() != null) {
            details.setTotalDistance(request.totalDistance());
        }
        if (request.totalDurationSec() != null) {
            details.setTotalDurationSec(request.totalDurationSec());
        }
        if (request.averagePace() != null) {
            details.setAveragePace(request.averagePace());
        }
        if (request.elevationGain() != null) {
            details.setElevationGain(request.elevationGain());
        }
        if (request.surfaceType() != null) {
            details.setSurfaceType(request.surfaceType());
        }
        if (request.sessionType() != null) {
            details.setSessionType(request.sessionType());
        }

        if (request.intervals() != null) {
            runIntervalRepository.deleteAll(details.getIntervals());

            List<RunInterval> intervals = new ArrayList<>();

            for (RunIntervalRequest intervalRequest : request.intervals()) {
                RunInterval interval = toIntervalEntity(intervalRequest, details);
                intervals.add(interval);
            }

            details.setIntervals(intervals);
        }

        if (request.splits() != null) {
            runSplitRepository.deleteAll(details.getSplits());

            List<RunSplit> splits = new ArrayList<>();

            for (RunSplitRequest splitRequest : request.splits()) {
                RunSplit split = toSplitEntity(splitRequest, details);
                splits.add(split);
            }

            details.setSplits(splits);
        }

        RunWorkoutDetails saved = runWorkoutDetailsRepository.save(details);

        return toResponse(saved);
    }

    @Override
    public void deleteRunDetailsByWorkoutId(Long workoutId) {

        RunWorkoutDetails details = runWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Run details not found for workout id " + workoutId));

        runWorkoutDetailsRepository.delete(details);
    }

    // ---- mapping helpers ----

    private RunInterval toIntervalEntity(RunIntervalRequest request, RunWorkoutDetails details) {

        RunInterval interval = new RunInterval();

        interval.setRunWorkout(details);
        interval.setType(request.type());
        interval.setOrderIndex(request.orderIndex());
        interval.setDistance(request.distance());
        interval.setDurationSec(request.durationSec());
        interval.setTimeSec(request.timeSec());
        interval.setAveragePace(request.averagePace());
        interval.setAverageHr(request.averageHr());
        interval.setRpe(request.rpe());
        interval.setNotes(request.notes());

        return interval;
    }

    private RunSplit toSplitEntity(RunSplitRequest request, RunWorkoutDetails details) {

        RunSplit split = new RunSplit();

        split.setRunWorkout(details);
        split.setKilometer(request.kilometer());
        split.setTimeSec(request.timeSec());
        split.setPace(request.pace());
        split.setAverageHr(request.averageHr());

        return split;
    }

    private RunWorkoutDetailsResponse toResponse(RunWorkoutDetails details) {

        List<RunIntervalResponse> intervalResponses = details.getIntervals().stream()
                .sorted(Comparator.comparing(RunInterval::getOrderIndex))
                .map(interval -> new RunIntervalResponse(
                        interval.getId(),
                        interval.getType(),
                        interval.getOrderIndex(),
                        interval.getDistance(),
                        interval.getDurationSec(),
                        interval.getTimeSec(),
                        interval.getAveragePace(),
                        interval.getAverageHr(),
                        interval.getRpe(),
                        interval.getNotes()
                    )
                )
                .toList();

        List<RunSplitResponse> splitResponses = details.getSplits().stream()
                .sorted(Comparator.comparing(RunSplit::getKilometer))
                .map(split -> new RunSplitResponse(
                        split.getId(),
                        split.getKilometer(),
                        split.getTimeSec(),
                        split.getPace(),
                        split.getAverageHr()))
                .toList();

        return new RunWorkoutDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getTotalDistance(),
                details.getTotalDurationSec(),
                details.getAveragePace(),
                details.getElevationGain(),
                details.getSurfaceType(),
                details.getSessionType(),
                intervalResponses,
                splitResponses
        );
    }

}
