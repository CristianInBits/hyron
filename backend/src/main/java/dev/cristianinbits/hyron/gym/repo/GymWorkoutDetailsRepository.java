package dev.cristianinbits.hyron.gym.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.cristianinbits.hyron.gym.domain.GymWorkoutDetails;

@Repository
public interface GymWorkoutDetailsRepository extends JpaRepository<GymWorkoutDetails, Long> {
    Optional<GymWorkoutDetails> findByWorkoutId(Long workoutId);
    
    // Método eficiente para borrado
    void deleteByWorkoutId(Long workoutId);
    
    // Check de seguridad
    boolean existsByWorkout_IdAndWorkout_User_Id(Long workoutId, Long userId);
}