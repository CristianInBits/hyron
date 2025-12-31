package dev.cristianinbits.hyron.exercise.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.cristianinbits.hyron.exercise.domain.Exercise;
import dev.cristianinbits.hyron.gym.domain.MuscleGroup;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    // Para listados
    List<Exercise> findByUserIdAndActiveTrue(Long userId);

    List<Exercise> findByUserId(Long userId);

    List<Exercise> findByUserIdAndMuscleGroupAndActiveTrue(Long userId, MuscleGroup muscleGroup);

    // Para operaciones individuales
    Optional<Exercise> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    // Para validación batch en GymWorkoutDetailsService
    List<Exercise> findAllByIdInAndUserId(List<Long> ids, Long userId);

    // Verificar nombre duplicado
    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);

    boolean existsByUserIdAndNameIgnoreCaseAndIdNot(Long userId, String name, Long id);

    // Buscar por nombre (ACTIVO O INACTIVO) para la lógica de resurrección
    Optional<Exercise> findByUserIdAndNameIgnoreCase(Long userId, String name);

    // Para validación en UPDATE: ¿Existe otro ejercicio ACTIVO con este nombre?
    boolean existsByUserIdAndNameIgnoreCaseAndActiveTrueAndIdNot(Long userId, String name, Long id);
}