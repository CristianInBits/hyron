package dev.cristianinbits.hyron.exercise.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.cristianinbits.hyron.exercise.domain.Exercise;
import dev.cristianinbits.hyron.gym.domain.MuscleGroup;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByUserIdAndActiveTrue(Long userId);

    List<Exercise> findByUserId(Long userId);

    List<Exercise> findByUserIdAndMuscleGroupAndActiveTrue(Long userId, MuscleGroup muscleGroup);

    Optional<Exercise> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    List<Exercise> findAllByIdInAndUserId(List<Long> ids, Long userId);

    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);

    boolean existsByUserIdAndNameIgnoreCaseAndIdNot(Long userId, String name, Long id);

    Optional<Exercise> findByUserIdAndNameIgnoreCase(Long userId, String name);

    boolean existsByUserIdAndNameIgnoreCaseAndActiveTrueAndIdNot(Long userId, String name, Long id);
}