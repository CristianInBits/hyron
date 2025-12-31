package dev.cristianinbits.hyron.exercise.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.ConflictException;
import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.exercise.domain.Exercise;
import dev.cristianinbits.hyron.exercise.dto.ExerciseCreateRequest;
import dev.cristianinbits.hyron.exercise.dto.ExerciseResponse;
import dev.cristianinbits.hyron.exercise.dto.ExerciseSummaryResponse;
import dev.cristianinbits.hyron.exercise.dto.ExerciseUpdateRequest;
import dev.cristianinbits.hyron.exercise.repo.ExerciseRepository;
import dev.cristianinbits.hyron.gym.domain.MuscleGroup;
import dev.cristianinbits.hyron.user.domain.User;
import dev.cristianinbits.hyron.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    @Override
    public ExerciseResponse createExercise(Long userId, ExerciseCreateRequest request) {
        // 1. Buscamos si ya existe algún ejercicio con ese nombre (Activo o Inactivo)
        Optional<Exercise> existingOpt = exerciseRepository.findByUserIdAndNameIgnoreCase(userId, request.name());

        if (existingOpt.isPresent()) {
            Exercise existing = existingOpt.get();
            
            // Caso A: Ya existe y está activo -> Error 409
            if (existing.isActive()) {
                throw new ConflictException("Exercise '" + request.name() + "' already exists");
            }
            
            // Caso B: Existe pero estaba borrado (Inactivo) -> REACTIVAR (Lázaro) 🧟‍♂️
            // Esto es genial porque recuperas el historial de estadísticas de ese ejercicio
            existing.setActive(true);
            existing.setMuscleGroup(request.muscleGroup()); // Actualizamos con los nuevos datos
            existing.setNotes(normalizeString(request.notes()));
            existing.setUnilateral(request.isUnilateral());
            
            return toResponse(exerciseRepository.save(existing));
        }

        // Caso C: No existe -> Crear nuevo
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Exercise exercise = Exercise.builder()
                .user(user)
                .name(request.name())
                .muscleGroup(request.muscleGroup())
                .notes(normalizeString(request.notes()))
                .isUnilateral(request.isUnilateral())
                .active(true)
                .build();

        return toResponse(exerciseRepository.save(exercise));
    }

    @Override
    @Transactional(readOnly = true)
    public ExerciseResponse getExercise(Long userId, Long exerciseId) {
        Exercise exercise = exerciseRepository.findByIdAndUserId(exerciseId, userId)
                .orElseThrow(() -> new NotFoundException("Exercise not found"));
        return toResponse(exercise);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseResponse> getAllExercises(Long userId) {
        return exerciseRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseSummaryResponse> getActiveExercises(Long userId) {
        return exerciseRepository.findByUserIdAndActiveTrue(userId).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseSummaryResponse> getActiveExercisesByMuscleGroup(Long userId, MuscleGroup muscleGroup) {
        return exerciseRepository.findByUserIdAndMuscleGroupAndActiveTrue(userId, muscleGroup).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Override
    public ExerciseResponse updateExercise(Long userId, Long exerciseId, ExerciseUpdateRequest request) {
        Exercise exercise = exerciseRepository.findByIdAndUserId(exerciseId, userId)
                .orElseThrow(() -> new NotFoundException("Exercise not found"));

        // Validar nombre único SOLO contra ejercicios ACTIVOS
        // Si cambio el nombre a "Sentadilla" y hay una "Sentadilla" inactiva antigua,
        // no pasa nada (el índice SQL único parcial lo permite), así que solo validamos contra activos.
        if (request.name() != null && !request.name().equalsIgnoreCase(exercise.getName())) {
            if (exerciseRepository.existsByUserIdAndNameIgnoreCaseAndActiveTrueAndIdNot(userId, request.name(), exerciseId)) {
                throw new ConflictException("Active exercise with name '" + request.name() + "' already exists");
            }
            exercise.setName(request.name());
        }

        if (request.muscleGroup() != null) exercise.setMuscleGroup(request.muscleGroup());
        if (request.notes() != null) exercise.setNotes(normalizeString(request.notes()));
        if (request.isUnilateral() != null) exercise.setUnilateral(request.isUnilateral());
        if (request.active() != null) exercise.setActive(request.active());

        Exercise saved = exerciseRepository.save(exercise);
        return toResponse(saved);
    }

    @Override
    public void deleteExercise(Long userId, Long exerciseId) {
        Exercise exercise = exerciseRepository.findByIdAndUserId(exerciseId, userId)
                .orElseThrow(() -> new NotFoundException("Exercise not found"));

        // Soft delete: marcar como inactivo
        exercise.setActive(false);
        exerciseRepository.save(exercise);
    }

    // ==================== Mappers ====================

    private ExerciseResponse toResponse(Exercise exercise) {
        return new ExerciseResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getMuscleGroup(),
                exercise.getNotes(),
                exercise.isUnilateral(),
                exercise.isActive()
        );
    }

    private ExerciseSummaryResponse toSummaryResponse(Exercise exercise) {
        return new ExerciseSummaryResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getMuscleGroup(),
                exercise.isUnilateral()
        );
    }

    private String normalizeString(String value) {
        return (value != null && !value.isBlank()) ? value.trim() : null;
    }
}