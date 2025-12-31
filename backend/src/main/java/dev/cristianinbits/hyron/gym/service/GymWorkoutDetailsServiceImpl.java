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
    private final ExerciseRepository exerciseRepository; // Catálogo

    @Override
    public GymDetailsResponse saveDetails(Long userId, Long workoutId, GymDetailsCreateRequest request) {
        // 1. Validar Workout Padre
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new NotFoundException("Workout not found"));

        if (workout.getType() != WorkoutType.GYM) {
            throw new BadRequestException("Workout type must be GYM");
        }

        // 2. Obtener o Crear Details
        GymWorkoutDetails details = gymRepository.findByWorkoutId(workoutId)
                .orElseGet(() -> GymWorkoutDetails.builder().workout(workout).build());

        details.setNotes(normalizeString(request.notes()));

        // 3. 🔥 VALIDACIÓN DE PROPIEDAD DEL CATÁLOGO (Batch)
        // Extraemos todos los IDs de ejercicios solicitados
        List<Long> requestedExerciseIds = request.exercises().stream()
                .map(GymExerciseRequest::exerciseId)
                .distinct()
                .toList();

        // Buscamos en BD solo esos IDs Y que pertenezcan al usuario
        List<Exercise> validExercises = exerciseRepository.findAllByIdInAndUserId(requestedExerciseIds, userId);

        // Si la cantidad no coincide, alguien intenta usar un ejercicio que no es suyo o no existe
        if (validExercises.size() != requestedExerciseIds.size()) {
            throw new NotFoundException("One or more exercises not found in your catalog");
        }

        // Convertimos la lista a un Map para acceso rápido O(1) en el bucle
        Map<Long, Exercise> exerciseMap = validExercises.stream()
                .collect(Collectors.toMap(Exercise::getId, Function.identity()));


        // 4. Estrategia Full Replace + Flush (Limpia jerarquía de 3 niveles)
        details.getExercises().clear();
        gymRepository.flush(); // Vital para evitar conflictos de orden

        // 5. Reconstrucción del Grafo de Objetos
        int exIndex = 1;
        for (GymExerciseRequest exReq : request.exercises()) {
            // Obtenemos la entidad Exercise del mapa (ya validada)
            Exercise catalogExercise = exerciseMap.get(exReq.exerciseId());
            
            GymExercise gymExercise = mapGymExercise(exReq, catalogExercise, exIndex++);
            details.addExercise(gymExercise);
        }

        // 6. Guardar y Responder
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
        // Validación de seguridad optimizada
        if (!gymRepository.existsByWorkout_IdAndWorkout_User_Id(workoutId, userId)) {
            throw new NotFoundException("Gym details not found");
        }
        gymRepository.deleteByWorkoutId(workoutId);
    }

    // ==================== Mappers & Helpers ====================

    private GymExercise mapGymExercise(GymExerciseRequest req, Exercise catalogExercise, int index) {
        GymExercise gymExercise = GymExercise.builder()
                .exercise(catalogExercise) // Asignamos la entidad del catálogo
                .orderIndex(index)
                .supersetId(normalizeString(req.supersetId()))
                .notes(normalizeString(req.notes()))
                .build();

        // Mapear Sets hijos
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
                .weightKg(req.weightKg() != null ? req.weightKg() : 0.0) // Default 0.0
                .reps(req.reps())
                .executionSeconds(req.executionSeconds())
                .rpe(req.rpe())
                .restSeconds(req.restSeconds())
                .notes(normalizeString(req.notes()))
                .build();
    }

    // --- Response Mappers ---

    private GymDetailsResponse toResponse(GymWorkoutDetails details) {
        return new GymDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getNotes(),
                details.getExercises().stream() // @OrderBy garantiza el orden
                        .map(this::toExerciseResponse)
                        .toList(),
                calculateTotalVolume(details)
        );
    }

    private GymExerciseResponse toExerciseResponse(GymExercise ex) {
        return new GymExerciseResponse(
                ex.getId(),
                ex.getOrderIndex(),
                ex.getSupersetId(),
                ex.getNotes(),
                ex.getExercise().getId(), // ID Catálogo
                ex.getExercise().getName(),  // Nombre Catálogo
                ex.getExercise().getMuscleGroup(), // Grupo Catálogo
                ex.getExercise().isUnilateral(),
                ex.getSets().stream()
                        .map(this::toSetResponse)
                        .toList()
        );
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
                set.getNotes()
        );
    }

    // --- Calculations ---
    
    private Double calculateTotalVolume(GymWorkoutDetails details) {
        // Suma simple: Weight * Reps de todas las series efectivas (WORK)
        // Podríamos excluir WARMUP aquí si quisieras
        return details.getExercises().stream()
                .flatMap(ex -> ex.getSets().stream())
                .filter(set -> set.getType() == GymSetType.WORK || set.getType() == GymSetType.FAILURE)
                .filter(set -> set.getReps() != null) // Solo si hay reps
                .mapToDouble(set -> set.getWeightKg() * set.getReps())
                .sum();
    }

    private String normalizeString(String value) {
        return (value != null && !value.isBlank()) ? value.trim() : null;
    }
}