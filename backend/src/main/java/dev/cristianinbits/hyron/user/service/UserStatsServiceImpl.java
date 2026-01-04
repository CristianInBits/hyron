package dev.cristianinbits.hyron.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.shoe.domain.Shoe;
import dev.cristianinbits.hyron.shoe.dto.ShoeStatsResponse;
import dev.cristianinbits.hyron.shoe.repo.ShoeRepository;
import dev.cristianinbits.hyron.user.dto.UserStatsResponse;
import dev.cristianinbits.hyron.user.repo.UserRepository;
import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserStatsServiceImpl implements UserStatsService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final ShoeRepository shoeRepository;

    @Override
    public UserStatsResponse getStats(Long userId) {
        // Verificar que el usuario existe
        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found with id " + userId);
        }

        // Calcular fechas
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        
        // Inicio de la semana (lunes)
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        Instant startOfWeekInstant = startOfWeek.atStartOfDay(zone).toInstant();
        
        // Inicio del mes
        LocalDate startOfMonth = today.withDayOfMonth(1);
        Instant startOfMonthInstant = startOfMonth.atStartOfDay(zone).toInstant();

        // Total histórico
        Integer totalWorkouts = workoutRepository.countByUserId(userId);

        // Workouts de esta semana
        List<Workout> workoutsThisWeek = workoutRepository
                .findByUserIdAndStartDateTimeAfter(userId, startOfWeekInstant);

        // Workouts de este mes
        List<Workout> workoutsThisMonth = workoutRepository
                .findByUserIdAndStartDateTimeAfter(userId, startOfMonthInstant);

        // Estadísticas semanales
        Integer workoutsThisWeekCount = workoutsThisWeek.size();
        Integer totalDurationSecondsThisWeek = calculateTotalDuration(workoutsThisWeek);
        Integer totalDistanceMetersThisWeek = calculateTotalDistance(workoutsThisWeek);
        Map<WorkoutType, Integer> workoutsByTypeThisWeek = countByType(workoutsThisWeek);

        // Estadísticas mensuales
        Integer workoutsThisMonthCount = workoutsThisMonth.size();
        Integer totalDurationSecondsThisMonth = calculateTotalDuration(workoutsThisMonth);
        Integer totalDistanceMetersThisMonth = calculateTotalDistance(workoutsThisMonth);

        // Último workout
        WorkoutSummaryResponse lastWorkout = workoutRepository
                .findFirstByUserIdOrderByStartDateTimeDesc(userId)
                .map(this::toSummaryResponse)
                .orElse(null);

        // Top 3 zapatillas activas por distancia
        List<ShoeStatsResponse> topShoes = shoeRepository
                .findByUserIdAndActiveOrderByInitialDistanceMetersDesc(userId, true)
                .stream()
                .map(this::toShoeStatsResponse)
                .sorted((a, b) -> {
                    // Ordenar por totalDistanceMeters descendente
                    Integer distA = a.totalDistanceMeters() != null ? a.totalDistanceMeters() : 0;
                    Integer distB = b.totalDistanceMeters() != null ? b.totalDistanceMeters() : 0;
                    return distB.compareTo(distA);
                })
                .limit(3)
                .toList();

        return new UserStatsResponse(
                totalWorkouts,
                workoutsThisWeekCount,
                totalDurationSecondsThisWeek,
                totalDistanceMetersThisWeek,
                workoutsThisMonthCount,
                totalDurationSecondsThisMonth,
                totalDistanceMetersThisMonth,
                workoutsByTypeThisWeek,
                lastWorkout,
                topShoes
        );
    }

    private Integer calculateTotalDuration(List<Workout> workouts) {
        int total = 0;
        
        for (Workout workout : workouts) {
            // Si tiene startDateTime y endDateTime, calcular diferencia
            if (workout.getStartDateTime() != null && workout.getEndDateTime() != null) {
                total += (int) Duration.between(
                        workout.getStartDateTime(),
                        workout.getEndDateTime()
                ).getSeconds();
            }
        }
        
        return total > 0 ? total : null;
    }

    private Integer calculateTotalDistance(List<Workout> workouts) {
        int total = 0;
        
        for (Workout workout : workouts) {
            // Run
            if (workout.getRunDetails() != null && workout.getRunDetails().getTotalDistanceMeters() != null) {
                total += workout.getRunDetails().getTotalDistanceMeters();
            }
            // Swim
            if (workout.getSwimDetails() != null && workout.getSwimDetails().getTotalDistanceMeters() != null) {
                total += workout.getSwimDetails().getTotalDistanceMeters();
            }
            // Hyrox: sumar distancias de los items
            if (workout.getHyroxDetails() != null && workout.getHyroxDetails().getBlocks() != null) {
                total += workout.getHyroxDetails().getBlocks().stream()
                        .flatMap(block -> block.getItems().stream())
                        .filter(item -> item.getDistanceMeters() != null)
                        .mapToInt(item -> item.getDistanceMeters())
                        .sum();
            }
        }
        
        return total > 0 ? total : null;
    }

    private Map<WorkoutType, Integer> countByType(List<Workout> workouts) {
        Map<WorkoutType, Integer> countByType = new EnumMap<>(WorkoutType.class);
        
        // Inicializar todos los tipos a 0
        for (WorkoutType type : WorkoutType.values()) {
            countByType.put(type, 0);
        }
        
        // Contar
        for (Workout workout : workouts) {
            countByType.merge(workout.getType(), 1, Integer::sum);
        }
        
        return countByType;
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

    private ShoeStatsResponse toShoeStatsResponse(Shoe shoe) {
        // Usar la misma lógica que ShoeService
        Long total = shoeRepository.getTotalDistanceMeters(shoe.getId());
        
        if (total == null) {
            total = (long) shoe.getInitialDistanceMeters();
        }

        Double percentageUsed = null;
        if (shoe.getMaxDistanceMeters() != null && shoe.getMaxDistanceMeters() > 0) {
            percentageUsed = (total * 100.0) / shoe.getMaxDistanceMeters();
        }

        return new ShoeStatsResponse(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getNickname(),
                total.intValue(),
                shoe.getMaxDistanceMeters(),
                percentageUsed
        );
    }
}