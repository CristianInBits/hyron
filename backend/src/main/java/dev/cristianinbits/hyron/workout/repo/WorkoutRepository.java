package dev.cristianinbits.hyron.workout.repo;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.dto.WorkoutSummaryResponse;
import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

        Optional<Workout> findByIdAndUserId(Long id, Long userId);

        boolean existsByIdAndUserId(Long id, Long userId);

        @Query("""
                SELECT w FROM Workout w
                LEFT JOIN FETCH w.hyroxDetails
                LEFT JOIN FETCH w.runDetails
                LEFT JOIN FETCH w.swimDetails
                LEFT JOIN FETCH w.gymDetails
                WHERE w.id = :id AND w.user.id = :userId
                """)
        Optional<Workout> findByIdAndUserIdWithDetails(
                @Param("id") Long id,
                @Param("userId") Long userId
        );

        @Query("""
                SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END
                FROM Workout w
                WHERE w.id = :workoutId
                AND (w.hyroxDetails IS NOT NULL
                        OR w.runDetails IS NOT NULL
                        OR w.swimDetails IS NOT NULL
                        OR w.gymDetails IS NOT NULL)
                """)
        boolean hasAnyDetails(@Param("workoutId") Long workoutId);

        Page<WorkoutSummaryResponse> findByUserId(Long userId, Pageable pageable);

        Page<WorkoutSummaryResponse> findByUserIdAndType(Long userId, WorkoutType type, Pageable pageable);

        Page<WorkoutSummaryResponse> findByUserIdAndStartDateTimeBetween(
                Long userId, Instant start, Instant end, Pageable pageable);

        Page<WorkoutSummaryResponse> findByUserIdAndTypeAndStartDateTimeBetween(
                Long userId, WorkoutType type, Instant start, Instant end, Pageable pageable);

        long countByUserId(Long userId);

        long countByUserIdAndStartDateTimeGreaterThanEqual(Long userId, Instant startDateTime);

        @Query("""
                SELECT COALESCE(SUM(r.totalDistanceMeters), 0)
                FROM RunWorkoutDetails r
                WHERE r.workout.user.id = :userId
                """)
        Long sumRunDistanceByUserId(@Param("userId") Long userId);

        @Query("""
                SELECT COALESCE(SUM(r.totalDistanceMeters), 0)
                FROM RunWorkoutDetails r
                WHERE r.workout.user.id = :userId
                AND r.workout.startDateTime >= :since
                """)
        Long sumRunDistanceByUserIdSince(@Param("userId") Long userId, @Param("since") Instant since);

        @Query("""
                SELECT COALESCE(SUM(s.totalDistanceMeters), 0)
                FROM SwimWorkoutDetails s
                WHERE s.workout.user.id = :userId
                """)
        Long sumSwimDistanceByUserId(@Param("userId") Long userId);

        @Query("""
                SELECT COALESCE(SUM(s.totalDistanceMeters), 0)
                FROM SwimWorkoutDetails s
                WHERE s.workout.user.id = :userId
                AND s.workout.startDateTime >= :since
                """)
        Long sumSwimDistanceByUserIdSince(@Param("userId") Long userId, @Param("since") Instant since);

        Optional<Workout> findFirstByUserIdOrderByStartDateTimeDesc(Long userId);

        @Query(value = """
                SELECT COALESCE(SUM(CAST(EXTRACT(EPOCH FROM (end_date_time - start_date_time)) AS BIGINT)), 0)
                FROM workouts
                WHERE user_id = :userId
                AND start_date_time IS NOT NULL AND end_date_time IS NOT NULL
                """, nativeQuery = true)
        Long sumTotalDurationSeconds(@Param("userId") Long userId);

        @Query(value = """
                SELECT COALESCE(SUM(CAST(EXTRACT(EPOCH FROM (end_date_time - start_date_time)) AS BIGINT)), 0)
                FROM workouts
                WHERE user_id = :userId
                AND start_date_time >= :since
                AND start_date_time IS NOT NULL AND end_date_time IS NOT NULL
                """, nativeQuery = true)
        Long sumTotalDurationSecondsSince(@Param("userId") Long userId, @Param("since") Instant since);
        
        @Query("""
                SELECT w.type, COUNT(w)
                FROM Workout w
                WHERE w.user.id = :userId AND w.startDateTime >= :since
                GROUP BY w.type
                """)
        List<Object[]> countWorkoutsByTypeSince(@Param("userId") Long userId, @Param("since") Instant since);

        @Query("""
                SELECT COALESCE(SUM(i.distanceMeters), 0)
                FROM HyroxItem i
                WHERE i.block.details.workout.user.id = :userId
                AND i.station = :station
                """)
        Long sumHyroxDistanceByUserIdAndStation(
                @Param("userId") Long userId, 
                @Param("station") HyroxStation station
        );

        @Query("""
                SELECT COALESCE(SUM(i.distanceMeters), 0)
                FROM HyroxItem i
                WHERE i.block.details.workout.user.id = :userId
                AND i.station = :station
                AND i.block.details.workout.startDateTime >= :since
                """)
        Long sumHyroxDistanceByUserIdAndStationSince(
                @Param("userId") Long userId, 
                @Param("station") HyroxStation station,
                @Param("since") Instant since
        );
}