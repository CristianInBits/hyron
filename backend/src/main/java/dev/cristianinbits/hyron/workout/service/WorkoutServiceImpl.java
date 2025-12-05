package dev.cristianinbits.hyron.workout.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.user.domain.User;
import dev.cristianinbits.hyron.user.repo.UserRepository;
import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutCreateRequest;
import dev.cristianinbits.hyron.workout.dto.WorkoutDetailResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;
import dev.cristianinbits.hyron.workout.dto.WorkoutUpdateRequest;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    @Override
    public WorkoutDetailResponse createWorkout(WorkoutCreateRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + request.userId()));

        Workout workout = new Workout();
        workout.setUser(user);
        workout.setType(request.type());
        workout.setStartDateTime(request.starDateTime());
        workout.setEndDateTime(request.endDateTime());
        workout.setGlobalRpe(request.globalRpe());
        workout.setNotes(request.notes());
        workout.setLocation(request.location());
        workout.setSource(request.source());

        Workout saved = workoutRepository.save(workout);
        return toDetailResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkoutDetailResponse getWorkoutById(Long id) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Workout not found with id " + id));
        return toDetailResponse(workout);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkoutSummaryResponse> getWorkoutByUser(Long userId) {
        return workoutRepository.findByUserId(userId).stream().map(this::toSummaryResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkoutSummaryResponse> getWorkoutByUserAndType(Long userId, WorkoutType type) {
        return workoutRepository.findByUserIdAndType(userId, type).stream().map(this::toSummaryResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkoutSummaryResponse> getWorkoutByUserAndDataRange(Long userId, LocalDateTime start,
            LocalDateTime end) {
        return workoutRepository.findByUserIdAndStartDateTimeBetween(userId, start, end).stream()
                .map(this::toSummaryResponse).toList();
    }

    @Override
    public WorkoutDetailResponse updateWorkout(Long id, WorkoutUpdateRequest request) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Workout not found with id " + id));

        workout.setType(request.type());
        workout.setStartDateTime(request.starDateTime());
        workout.setEndDateTime(request.enDateTime());
        workout.setGlobalRpe(request.globalRpe());
        workout.setNotes(request.notes());
        workout.setLocation(request.source());

        Workout saved = workoutRepository.save(workout);
        return toDetailResponse(saved);
    }

    @Override
    public void deleteWorkout(Long id) {
        if (!workoutRepository.existsById(id)) {
            throw new EntityNotFoundException("Workout not found with id " + id);
        }
        workoutRepository.deleteById(id);
    }

    private WorkoutSummaryResponse toSummaryResponse(Workout workout) {
        return new WorkoutSummaryResponse(
            workout.getId(),
            workout.getType(),
            workout.getStartDateTime(),
            workout.getEndDateTime(),
            workout.getGlobalRpe(),
            workout.getLocation()
        );
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
            workout.getHyroxDetails() != null,
            workout.getRunDetails() != null,
            workout.getSwimDetails() != null,
            workout.getGymDetails() != null
        );
    }
}
