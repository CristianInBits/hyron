package dev.cristianinbits.hyron.gym.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.BadRequestException;
import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.exercise.domain.Exercise;
import dev.cristianinbits.hyron.gym.domain.GymExercise;
import dev.cristianinbits.hyron.gym.domain.GymSet;
import dev.cristianinbits.hyron.gym.domain.GymSetType;
import dev.cristianinbits.hyron.gym.domain.GymWorkoutDetails;
import dev.cristianinbits.hyron.gym.dto.GymDetailsCreateRequest;
import dev.cristianinbits.hyron.gym.dto.GymDetailsResponse;
import dev.cristianinbits.hyron.gym.dto.GymExerciseRequest;
import dev.cristianinbits.hyron.gym.dto.GymExerciseResponse;
import dev.cristianinbits.hyron.gym.dto.GymSetRequest;
import dev.cristianinbits.hyron.gym.dto.GymSetResponse;
import dev.cristianinbits.hyron.exercise.repo.ExerciseRepository;
import dev.cristianinbits.hyron.gym.repo.GymWorkoutDetailsRepository;
import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class GymWorkoutDetailsServiceImpl implements GymWorkoutDetailsService {

    private final GymWorkoutDetailsRepository gymRepository;
    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    @Override
    public GymDetailsResponse saveDetails(Long userId, Long workoutId, GymDetailsCreateRequest request) {

        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new NotFoundException("Workout not found"));

        if (workout.getType() != WorkoutType.GYM) {
            throw new BadRequestException("Workout type must be GYM");
        }

        GymWorkoutDetails details = gymRepository.findByWorkoutId(workoutId)
                .orElseGet(() -> GymWorkoutDetails.builder().workout(workout).build());

        details.setNotes(normalizeString(request.notes()));
        details.setTotalDurationSeconds(request.totalDurationSeconds());

        List<Long> requestedExerciseIds = request.exercises().stream()
                .map(GymExerciseRequest::exerciseId)
                .distinct()
                .toList();

        List<Exercise> validExercises = exerciseRepository.findAllByIdInAndUserId(requestedExerciseIds, userId);

        if (validExercises.size() != requestedExerciseIds.size()) {
            throw new NotFoundException("One or more exercises not found in your catalog");
        }

        Map<Long, Exercise> exerciseMap = validExercises.stream()
                .collect(Collectors.toMap(Exercise::getId, Function.identity()));

        details.getExercises().clear();
        gymRepository.flush();

        int exIndex = 1;
        for (GymExerciseRequest exReq : request.exercises()) {
            Exercise catalogExercise = exerciseMap.get(exReq.exerciseId());

            GymExercise gymExercise = mapGymExercise(exReq, catalogExercise, exIndex++);
            details.addExercise(gymExercise);
        }

        GymWorkoutDetails saved = gymRepository.save(details);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public GymDetailsResponse getDetails(Long userId, Long workoutId) {
        if (!workoutRepository.existsByIdAndUserId(workoutId, userId)) {
            throw new NotFoundException("Workout not found");
        }

        GymWorkoutDetails details = gymRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Gym details not found"));

        return toResponse(details);
    }

    @Override
    public void deleteDetails(Long userId, Long workoutId) {
        if (!gymRepository.existsByWorkout_IdAndWorkout_User_Id(workoutId, userId)) {
            throw new NotFoundException("Gym details not found");
        }
        gymRepository.deleteByWorkoutId(workoutId);
    }

    private GymExercise mapGymExercise(GymExerciseRequest req, Exercise catalogExercise, int index) {
        GymExercise gymExercise = GymExercise.builder()
                .exercise(catalogExercise)
                .orderIndex(index)
                .supersetId(normalizeString(req.supersetId()))
                .notes(normalizeString(req.notes()))
                .build();

        int setIndex = 1;
        for (GymSetRequest setReq : req.sets()) {
            gymExercise.addSet(mapGymSet(setReq, setIndex++));
        }

        return gymExercise;
    }

    private GymSet mapGymSet(GymSetRequest req, int index) {
        return GymSet.builder()
                .orderIndex(index)
                .type(req.type())
                .weightKg(req.weightKg() != null ? req.weightKg() : 0.0)
                .reps(req.reps())
                .executionSeconds(req.executionSeconds())
                .rpe(req.rpe())
                .restSeconds(req.restSeconds())
                .notes(normalizeString(req.notes()))
                .build();
    }

    private GymDetailsResponse toResponse(GymWorkoutDetails details) {

        Integer totalDurationSeconds = details.getTotalDurationSeconds();

        if (totalDurationSeconds == null) {
            totalDurationSeconds = details.getExercises().stream()
                    .flatMap(ex -> ex.getSets().stream())
                    .mapToInt(set -> {
                        int execution = set.getExecutionSeconds() != null ? set.getExecutionSeconds() : 0;
                        int rest = set.getRestSeconds() != null ? set.getRestSeconds() : 0;
                        return execution + rest;
                    })
                    .sum();

            totalDurationSeconds = totalDurationSeconds > 0 ? totalDurationSeconds : null;
        }

        return new GymDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getNotes(),
                details.getExercises().stream()
                        .map(this::toExerciseResponse)
                        .toList(),
                totalDurationSeconds,
                calculateTotalVolume(details));
    }

    private GymExerciseResponse toExerciseResponse(GymExercise ex) {
        return new GymExerciseResponse(
                ex.getId(),
                ex.getOrderIndex(),
                ex.getSupersetId(),
                ex.getNotes(),
                ex.getExercise().getId(),
                ex.getExercise().getName(),
                ex.getExercise().getMuscleGroup(),
                ex.getExercise().isUnilateral(),
                ex.getSets().stream()
                        .map(this::toSetResponse)
                        .toList());
    }

    private GymSetResponse toSetResponse(GymSet set) {
        return new GymSetResponse(
                set.getId(),
                set.getOrderIndex(),
                set.getType(),
                set.getWeightKg(),
                set.getReps(),
                set.getRpe(),
                set.getRestSeconds(),
                set.getExecutionSeconds(),
                set.getNotes());
    }

    private Double calculateTotalVolume(GymWorkoutDetails details) {
        return details.getExercises().stream()
                .flatMap(ex -> ex.getSets().stream())
                .filter(set -> set.getType() == GymSetType.WORK || set.getType() == GymSetType.FAILURE)
                .filter(set -> set.getReps() != null)
                .mapToDouble(set -> set.getWeightKg() * set.getReps())
                .sum();
    }

    private String normalizeString(String value) {
        return (value != null && !value.isBlank()) ? value.trim() : null;
    }
}