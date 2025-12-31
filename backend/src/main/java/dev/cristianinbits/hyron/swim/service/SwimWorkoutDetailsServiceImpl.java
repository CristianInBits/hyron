package dev.cristianinbits.hyron.swim.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.BadRequestException;
import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.swim.domain.SwimInterval;
import dev.cristianinbits.hyron.swim.domain.SwimWorkoutDetails;
import dev.cristianinbits.hyron.swim.dto.SwimDetailsCreateRequest;
import dev.cristianinbits.hyron.swim.dto.SwimDetailsResponse;
import dev.cristianinbits.hyron.swim.dto.SwimIntervalRequest;
import dev.cristianinbits.hyron.swim.dto.SwimIntervalResponse;
import dev.cristianinbits.hyron.swim.repo.SwimWorkoutDetailsRepository;
import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SwimWorkoutDetailsServiceImpl implements SwimWorkoutDetailsService {

    private final SwimWorkoutDetailsRepository swimRepository;
    private final WorkoutRepository workoutRepository;

    @Override
    public SwimDetailsResponse saveDetails(Long userId, Long workoutId, SwimDetailsCreateRequest request) {
        // 1. Validar Workout Padre
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new NotFoundException("Workout not found"));

        if (workout.getType() != WorkoutType.SWIM) {
            throw new BadRequestException("Workout type must be SWIM");
        }

        // 2. Obtener o Crear
        SwimWorkoutDetails details = swimRepository.findByWorkoutId(workoutId)
                .orElseGet(() -> SwimWorkoutDetails.builder().workout(workout).build());

        // 3. Actualizar Datos Básicos
        details.setPoolType(request.poolType());
        details.setNotes(normalizeString(request.notes()));

        // 4. Estrategia Full Replace (Anti-Bug de índices únicos)
        details.getIntervals().clear();
        swimRepository.flush(); 

        // 5. Mapear Intervalos
        int index = 1;
        for (SwimIntervalRequest intervalReq : request.intervals()) {
            details.addInterval(mapInterval(intervalReq, index++));
        }

        // 6. Lógica de Totales (Manual > Calculado)
        // Usamos details.getIntervals() que ya contiene los nuevos items
        if (request.totalDistanceMeters() != null) {
            details.setTotalDistanceMeters(request.totalDistanceMeters());
        } else {
            details.setTotalDistanceMeters(calculateTotalDistance(details.getIntervals()));
        }

        if (request.totalTimeSeconds() != null) {
            details.setTotalTimeSeconds(request.totalTimeSeconds());
        } else {
            details.setTotalTimeSeconds(calculateTotalTime(details.getIntervals()));
        }

        SwimWorkoutDetails saved = swimRepository.save(details);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SwimDetailsResponse getDetails(Long userId, Long workoutId) {
        if (!workoutRepository.existsByIdAndUserId(workoutId, userId)) {
            throw new NotFoundException("Workout not found");
        }

        SwimWorkoutDetails details = swimRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Swim details not found"));

        return toResponse(details);
    }

    @Override
    public void deleteDetails(Long userId, Long workoutId) {
        // Validación de seguridad (1 query ligera)
        if (!swimRepository.existsByWorkout_IdAndWorkout_User_Id(workoutId, userId)) {
            throw new NotFoundException("Swim details not found");
        }
        // Borrado eficiente
        swimRepository.deleteByWorkoutId(workoutId);
    }

    // ==================== Mappers ====================

    private SwimInterval mapInterval(SwimIntervalRequest request, int index) {
        return SwimInterval.builder()
                .orderIndex(index)
                .type(request.type())
                .stroke(request.stroke())
                .distanceMeters(request.distanceMeters())
                .durationSeconds(request.durationSeconds())
                .restSeconds(request.restSeconds())
                .rpe(request.rpe())
                // OPTIMIZACIÓN: Tu DTO ya garantiza que equipment no es null (Set.of()), 
                // pero creamos un HashSet nuevo para garantizar mutabilidad por si acaso.
                .equipment(new HashSet<>(request.equipment())) 
                .notes(normalizeString(request.notes()))
                .build();
    }

    private SwimDetailsResponse toResponse(SwimWorkoutDetails details) {
        return new SwimDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getPoolType(),
                details.getTotalDistanceMeters(),
                details.getTotalTimeSeconds(),
                details.getNotes(),
                calculateAveragePace(details), // Pace Global
                // Confiamos en @OrderBy("orderIndex ASC") de la entidad
                details.getIntervals().stream()
                        .map(this::toIntervalResponse)
                        .toList()
        );
    }

    private SwimIntervalResponse toIntervalResponse(SwimInterval interval) {
        return new SwimIntervalResponse(
                interval.getId(),
                interval.getOrderIndex(),
                interval.getType(),
                interval.getStroke(),
                interval.getDistanceMeters(),
                interval.getDurationSeconds(),
                interval.getRestSeconds(),
                interval.getRpe(),
                interval.getEquipment(), // El Converter lo transformó de String a Set automáticamente
                interval.getNotes(),
                calculatePace(interval.getDistanceMeters(), interval.getDurationSeconds())
        );
    }

    // ==================== Cálculos ====================

    private Integer calculateTotalDistance(List<SwimInterval> intervals) {
        if (intervals == null || intervals.isEmpty()) return null;
        int total = intervals.stream()
                .map(i -> i.getDistanceMeters() != null ? i.getDistanceMeters() : 0)
                .reduce(0, Integer::sum);
        return total > 0 ? total : null;
    }

    private Integer calculateTotalTime(List<SwimInterval> intervals) {
        if (intervals == null || intervals.isEmpty()) return null;
        int total = intervals.stream()
                .map(i -> i.getDurationSeconds() != null ? i.getDurationSeconds() : 0)
                .reduce(0, Integer::sum);
        return total > 0 ? total : null;
    }

    private Integer calculateAveragePace(SwimWorkoutDetails details) {
        // Evitar división por cero
        if (details.getTotalDistanceMeters() == null || details.getTotalDistanceMeters() == 0) return null;
        if (details.getTotalTimeSeconds() == null || details.getTotalTimeSeconds() == 0) return null;

        // Fórmula Natación: (Segundos * 100) / Metros
        return (details.getTotalTimeSeconds() * 100) / details.getTotalDistanceMeters();
    }

    private Integer calculatePace(Integer distanceMeters, Integer durationSeconds) {
        if (distanceMeters == null || distanceMeters == 0 || durationSeconds == null) return null;
        return (durationSeconds * 100) / distanceMeters;
    }

    private String normalizeString(String value) {
        return (value != null && !value.isBlank()) ? value.trim() : null;
    }
}