package dev.cristianinbits.hyron.swim.service;

import dev.cristianinbits.hyron.exception.NotFoundException;

import dev.cristianinbits.hyron.swim.domain.SwimSet;
import dev.cristianinbits.hyron.swim.domain.SwimStroke;
import dev.cristianinbits.hyron.swim.domain.SwimWorkoutDetails;
import dev.cristianinbits.hyron.swim.dto.SwimSetRequest;
import dev.cristianinbits.hyron.swim.dto.SwimSetResponse;
import dev.cristianinbits.hyron.swim.dto.SwimWorkoutDetailsCreateRequest;
import dev.cristianinbits.hyron.swim.dto.SwimWorkoutDetailsResponse;
import dev.cristianinbits.hyron.swim.dto.SwimWorkoutDetailsUpdateRequest;
import dev.cristianinbits.hyron.swim.repo.SwimSetRepository;
import dev.cristianinbits.hyron.swim.repo.SwimWorkoutDetailsRepository;

import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SwimWorkoutServiceImpl implements SwimWorkoutService {

    private final SwimWorkoutDetailsRepository swimWorkoutDetailsRepository;
    private final SwimSetRepository swimSetRepository;
    private final WorkoutRepository workoutRepository;

    @Override
    public SwimWorkoutDetailsResponse createOrReplaceSwimDetails(SwimWorkoutDetailsCreateRequest request) {
        Long workoutId = request.workoutId();

        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new NotFoundException("Workout not found with id " + workoutId));

        swimWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .ifPresent(existing -> swimWorkoutDetailsRepository.delete(existing));

        SwimWorkoutDetails details = new SwimWorkoutDetails();
        details.setWorkout(workout);
        details.setTotalDistance(request.totalDistance());
        details.setTotalDurationSec(request.totalDurationSec());
        details.setAveragePace(request.averagePace());
        details.setMainStroke(request.mainStroke());
        details.setSessionType(request.sessionType());

        List<SwimSet> sets = new ArrayList<>();
        if (request.sets() != null) {
            for (SwimSetRequest setRequest : request.sets()) {
                SwimSet set = toSetEntity(setRequest, details);
                sets.add(set);
            }
        }

        details.setSets(sets);

        SwimWorkoutDetails saved = swimWorkoutDetailsRepository.save(details);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SwimWorkoutDetailsResponse getSwimDetailsByWorkoutId(Long workoutId) {

        SwimWorkoutDetails details = swimWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Swim details not found for workout id " + workoutId));

        return toResponse(details);
    }

    @Override
    public SwimWorkoutDetailsResponse updateSwimDetails(Long workoutId, SwimWorkoutDetailsUpdateRequest request) {

        SwimWorkoutDetails details = swimWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Swim details not found for workout id " + workoutId));

        if (request.totalDistance() != null) {
            details.setTotalDistance(request.totalDistance());
        }
        if (request.totalDurationSec() != null) {
            details.setTotalDurationSec(request.totalDurationSec());
        }
        if (request.averagePace() != null) {
            details.setAveragePace(request.averagePace());
        }
        if (request.mainStroke() != null) {
            details.setMainStroke(request.mainStroke());
        }
        if (request.sessionType() != null) {
            details.setSessionType(request.sessionType());
        }

        if (request.sets() != null) {

            swimSetRepository.deleteAll(details.getSets());

            List<SwimSet> sets = new ArrayList<>();
            for (SwimSetRequest setRequest : request.sets()) {
                SwimSet set = toSetEntity(setRequest, details);
                sets.add(set);
            }

            details.setSets(sets);
        }

        SwimWorkoutDetails saved = swimWorkoutDetailsRepository.save(details);

        return toResponse(saved);
    }

    @Override
    public void deleteSwimDetailsByWorkoutId(Long workoutId) {

        SwimWorkoutDetails details = swimWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Swim details not found for workout id " + workoutId));
    
        swimWorkoutDetailsRepository.delete(details);
    }

    // ---------- mapping DTO -> entidad ----------

    private SwimSet toSetEntity(SwimSetRequest request, SwimWorkoutDetails details) {
    
        SwimSet set = new SwimSet();
    
        set.setSwimWorkout(details);
        set.setOrderIndex(request.orderIndex());
        set.setRepetitions(request.repetitions());
        set.setDistancePerRep(request.distancePerRep());
        set.setTargetPace(request.targetPace());
        set.setTotalBlockTimeSec(request.totalBlockTimeSec());
        set.setRestBetweenRepsSec(request.restBetweenRepsSec());
        set.setNotes(request.notes());
        SwimStroke stroke = request.stroke();
        set.setStroke(stroke);
    
        return set;
    }

    // ---------- mapping entidad -> DTO ----------

    private SwimWorkoutDetailsResponse toResponse(SwimWorkoutDetails details) {

        List<SwimSetResponse> setResponses = details.getSets()
                .stream()
                .sorted(Comparator.comparing(SwimSet::getOrderIndex))
                .map(this::toSetResponse)
                .toList();

        return new SwimWorkoutDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getTotalDistance(),
                details.getTotalDurationSec(),
                details.getAveragePace(),
                details.getMainStroke(),
                details.getSessionType(),
                setResponses
        );
    }

    private SwimSetResponse toSetResponse(SwimSet set) {

        return new SwimSetResponse(
                set.getId(),
                set.getOrderIndex(),
                set.getRepetitions(),
                set.getDistancePerRep(),
                set.getTargetPace(),
                set.getTotalBlockTimeSec(),
                set.getRestBetweenRepsSec(),
                set.getNotes(),
                set.getStroke()
        );
    }
}
