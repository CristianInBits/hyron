package dev.cristianinbits.hyron.workout.repo;

import java.time.Instant;
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

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    // ==================== Ownership-scoped queries ====================

    Optional<Workout> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    // ==================== Eager fetch with details ====================

    /*
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
     */
    @Query("""
            SELECT w FROM Workout w
            LEFT JOIN FETCH w.hyroxDetails
            LEFT JOIN FETCH w.runDetails
            WHERE w.id = :id AND w.user.id = :userId
            """)
    Optional<Workout> findByIdAndUserIdWithDetails(
            @Param("id") Long id,
            @Param("userId") Long userId
    );

    // ==================== Detail existence check ====================

    /*
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
    */
    @Query("""
            SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END
            FROM Workout w
            WHERE w.id = :workoutId
            AND (w.hyroxDetails IS NOT NULL
            OR w.runDetails IS NOT NULL)
            """)
    boolean hasAnyDetails(@Param("workoutId") Long workoutId);

    // ==================== DTO Projections for listings ====================

    Page<WorkoutSummaryResponse> findByUserId(Long userId, Pageable pageable);

    Page<WorkoutSummaryResponse> findByUserIdAndType(Long userId, WorkoutType type, Pageable pageable);

    Page<WorkoutSummaryResponse> findByUserIdAndStartDateTimeBetween(
            Long userId, Instant start, Instant end, Pageable pageable);

    Page<WorkoutSummaryResponse> findByUserIdAndTypeAndStartDateTimeBetween(
            Long userId, WorkoutType type, Instant start, Instant end, Pageable pageable);
}