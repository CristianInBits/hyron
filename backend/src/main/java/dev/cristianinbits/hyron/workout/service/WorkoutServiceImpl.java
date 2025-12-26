package dev.cristianinbits.hyron.workout.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.BadRequestException;
import dev.cristianinbits.hyron.common.exception.ConflictException;
import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.user.domain.User;
import dev.cristianinbits.hyron.user.repo.UserRepository;

import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutCreateRequest;
import dev.cristianinbits.hyron.workout.dto.WorkoutDetailResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutUpdateRequest;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    @Override
    public WorkoutDetailResponse createWorkout(Long userId, WorkoutCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id " + userId));

        Workout workout = new Workout();
        workout.setUser(user);
        workout.setType(request.type());
        workout.setStartDateTime(request.startDateTime());
        workout.setEndDateTime(request.endDateTime());
        workout.setGlobalRpe(request.globalRpe());
        workout.setNotes(normalizeString(request.notes()));
        workout.setLocation(normalizeString(request.location()));
        workout.setSource(normalizeString(request.source()));

        Workout saved = workoutRepository.save(workout);
        return toDetailResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkoutDetailResponse getWorkoutById(Long userId, Long workoutId) {
        Workout workout = workoutRepository.findByIdAndUserIdWithDetails(workoutId, userId)
                .orElseThrow(() -> new NotFoundException("Workout not found"));
        return toDetailResponse(workout);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WorkoutSummaryResponse> getWorkouts(
            Long userId, WorkoutType type, Instant start, Instant end, Pageable pageable) {

        if ((start != null && end == null) || (start == null && end != null)) {
            throw new BadRequestException("Both 'start' and 'end' must be provided together");
        }
        if (start != null && !end.isAfter(start)) {
            throw new BadRequestException("End date must be after start date");
        }

        if (type != null && start != null) {
            return workoutRepository.findByUserIdAndTypeAndStartDateTimeBetween(userId, type, start, end, pageable);
        }
        if (type != null) {
            return workoutRepository.findByUserIdAndType(userId, type, pageable);
        }
        if (start != null) {
            return workoutRepository.findByUserIdAndStartDateTimeBetween(userId, start, end, pageable);
        }
        return workoutRepository.findByUserId(userId, pageable);
    }

    @Override
    public WorkoutDetailResponse updateWorkout(Long userId, Long workoutId, WorkoutUpdateRequest request) {
        
        if (request.type() == null
            && request.startDateTime() == null
            && request.endDateTime() == null
            && request.globalRpe() == null
            && request.notes() == null
            && request.location() == null
            && request.source() == null) {
            throw new BadRequestException("No fields provided to update");
        }
        
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new NotFoundException("Workout not found"));

        

        if (request.type() != null && request.type() != workout.getType()) {
            if (workoutRepository.hasAnyDetails(workoutId)) {
                throw new ConflictException("Cannot change workout type while details exist. Delete details first.");
            }
            workout.setType(request.type());
        }

        updateDates(workout, request.startDateTime(), request.endDateTime());

        if (request.globalRpe() != null) workout.setGlobalRpe(request.globalRpe());
        if (request.notes() != null) workout.setNotes(normalizeString(request.notes()));
        if (request.location() != null) workout.setLocation(normalizeString(request.location()));
        if (request.source() != null) workout.setSource(normalizeString(request.source()));

        return toDetailResponse(workoutRepository.save(workout));
    }

    @Override
    public void deleteWorkout(Long userId, Long workoutId) {
        if (!workoutRepository.existsByIdAndUserId(workoutId, userId)) {
            throw new NotFoundException("Workout not found");
        }
        workoutRepository.deleteById(workoutId);
    }

    // ==================== Helpers ====================

    private void updateDates(Workout workout, Instant newStart, Instant newEnd) {
        Instant effectiveStart = newStart != null ? newStart : workout.getStartDateTime();
        Instant effectiveEnd = newEnd != null ? newEnd : workout.getEndDateTime();

        if (effectiveStart != null && effectiveEnd != null && !effectiveEnd.isAfter(effectiveStart)) {
            throw new BadRequestException("End date must be after start date");
        }

        if (newStart != null) workout.setStartDateTime(newStart);
        if (newEnd != null) workout.setEndDateTime(newEnd);
    }

    private String normalizeString(String value) {
        return (value != null && !value.isBlank()) ? value.trim() : null;
    }

    private WorkoutDetailResponse toDetailResponse(Workout workout) {
        return new WorkoutDetailResponse(
                workout.getId(),
                workout.getUser().getId(),
                workout.getType(),
                workout.getStartDateTime(),
                workout.getEndDateTime(),
                workout.getGlobalRpe(),
                workout.getNotes(),
                workout.getLocation(),
                workout.getSource(),
                workout.getHyroxDetails() != null ? workout.getHyroxDetails().getId() : null
                //workout.getRunDetails() != null ? workout.getRunDetails().getId() : null,
                //workout.getSwimDetails() != null ? workout.getSwimDetails().getId() : null,
                //workout.getGymDetails() != null ? workout.getGymDetails().getId() : null
        );
    }
}