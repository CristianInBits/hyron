package dev.cristianinbits.hyron.gym.service;

import dev.cristianinbits.hyron.exception.NotFoundException;

import dev.cristianinbits.hyron.gym.domain.GymExerciseEntry;
import dev.cristianinbits.hyron.gym.domain.GymSet;
import dev.cristianinbits.hyron.gym.domain.GymWorkoutDetails;
import dev.cristianinbits.hyron.gym.dto.GymExerciseEntryRequest;
import dev.cristianinbits.hyron.gym.dto.GymExerciseEntryResponse;
import dev.cristianinbits.hyron.gym.dto.GymSetRequest;
import dev.cristianinbits.hyron.gym.dto.GymSetResponse;
import dev.cristianinbits.hyron.gym.dto.GymWorkoutDetailsCreateRequest;
import dev.cristianinbits.hyron.gym.dto.GymWorkoutDetailsResponse;
import dev.cristianinbits.hyron.gym.dto.GymWorkoutDetailsUpdateRequest;
import dev.cristianinbits.hyron.gym.repo.GymExerciseEntryRepository;
import dev.cristianinbits.hyron.gym.repo.GymSetRepository;
import dev.cristianinbits.hyron.gym.repo.GymWorkoutDetailsRepository;
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
public class GymWorkoutServiceImpl implements GymWorkoutService {

    private final GymWorkoutDetailsRepository gymWorkoutDetailsRepository;
    private final GymExerciseEntryRepository gymExerciseEntryRepository;
    private final GymSetRepository gymSetRepository;
    private final WorkoutRepository workoutRepository;

    @Override
    public GymWorkoutDetailsResponse createOrReplaceGymDetails(GymWorkoutDetailsCreateRequest request) {

        Long workoutId = request.workoutId();

        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new NotFoundException("Workout not found with id " + workoutId));

        gymWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .ifPresent(existing -> gymWorkoutDetailsRepository.delete(existing));

        GymWorkoutDetails details = new GymWorkoutDetails();
        details.setWorkout(workout);
        details.setGoal(request.goal());
        details.setMainMuscleGroup(request.mainMuscleGroup());
        details.setTotalVolume(request.totalVolume());

        List<GymExerciseEntry> exercises = new ArrayList<>();
        if (request.exercises() != null) {
            for (GymExerciseEntryRequest exerciseRequest : request.exercises()) {
                GymExerciseEntry entry = toExerciseEntity(exerciseRequest, details);
                exercises.add(entry);
            }
        }
        details.setExercises(exercises);

        GymWorkoutDetails saved = gymWorkoutDetailsRepository.save(details);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public GymWorkoutDetailsResponse getGymDetailsByWorkoutId(Long workoutId) {

        GymWorkoutDetails details = gymWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Gym details not found for workout id " + workoutId));

        return toResponse(details);
    }

    @Override
    public GymWorkoutDetailsResponse updateGymDetails(Long workoutId, GymWorkoutDetailsUpdateRequest request) {
        GymWorkoutDetails details = gymWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Gym details not found for workout id " + workoutId));

        if (request.goal() != null) {
            details.setGoal(request.goal());
        }
        if (request.mainMuscleGroup() != null) {
            details.setMainMuscleGroup(request.mainMuscleGroup());
        }
        if (request.totalVolume() != null) {
            details.setTotalVolume(request.totalVolume());
        }

        if (request.exercises() != null) {
            gymSetRepository.deleteAll(
                    details.getExercises()
                            .stream()
                            .flatMap(e -> e.getSets().stream())
                            .toList()
            );
            gymExerciseEntryRepository.deleteAll(details.getExercises());

            List<GymExerciseEntry> exercises = new ArrayList<>();
            for (GymExerciseEntryRequest exerciseRequest : request.exercises()) {
                GymExerciseEntry entry = toExerciseEntity(exerciseRequest, details);
                exercises.add(entry);
            }
            details.setExercises(exercises);
        }

        GymWorkoutDetails saved = gymWorkoutDetailsRepository.save(details);

        return toResponse(saved);
    }

    @Override
    public void deleteGymDetailsByWorkoutId(Long workoutId) {

        GymWorkoutDetails details = gymWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Gym details not found for workout id " + workoutId));
    
        gymWorkoutDetailsRepository.delete(details);
    }

    // ---------- mapping DTO -> entidad ----------

    private GymExerciseEntry toExerciseEntity(GymExerciseEntryRequest request, GymWorkoutDetails details) {

        GymExerciseEntry entry = new GymExerciseEntry();

        entry.setGymWorkout(details);
        entry.setOrderIndex(request.orderIndex());
        entry.setExerciseName(request.exerciseName());
        entry.setNotes(request.notes());
        entry.setMuscleGroup(request.muscleGroup());

        List<GymSet> sets = new ArrayList<>();
        if (request.sets() != null) {
            for (GymSetRequest setRequest : request.sets()) {
                GymSet set = toSetEntity(setRequest, entry);
                sets.add(set);
            }
        }
        entry.setSets(sets);

        return entry;
    }

    private GymSet toSetEntity(GymSetRequest request, GymExerciseEntry entry) {

        GymSet set = new GymSet();

        set.setExerciseEntry(entry);
        set.setSetNumber(request.setNumber());
        set.setReps(request.reps());
        set.setWeight(request.weight());
        set.setRpe(request.rpe());
        set.setRestAfterSetSec(request.restAfterSetSec());
        set.setCompleted(request.completed());

        return set;
    }

    // ---------- mapping entidad -> DTO ----------

    private GymWorkoutDetailsResponse toResponse(GymWorkoutDetails details) {

        List<GymExerciseEntryResponse> exerciseResponses = details.getExercises()
                .stream()
                .sorted(Comparator.comparing(GymExerciseEntry::getOrderIndex))
                .map(this::toExerciseResponse)
                .toList();

        return new GymWorkoutDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getGoal(),
                details.getMainMuscleGroup(),
                details.getTotalVolume(),
                exerciseResponses
        );
    }

    private GymExerciseEntryResponse toExerciseResponse(GymExerciseEntry entry) {

        List<GymSetResponse> setResponses = entry.getSets()
                .stream()
                .sorted(Comparator.comparing(GymSet::getSetNumber))
                .map(this::toSetResponse)
                .toList();

        return new GymExerciseEntryResponse(
                entry.getId(),
                entry.getOrderIndex(),
                entry.getExerciseName(),
                entry.getNotes(),
                entry.getMuscleGroup(),
                setResponses
        );
    }

    private GymSetResponse toSetResponse(GymSet set) {
        return new GymSetResponse(
                set.getId(),
                set.getSetNumber(),
                set.getReps(),
                set.getWeight(),
                set.getRpe(),
                set.getRestAfterSetSec(),
                set.getCompleted()
        );
    }
}
