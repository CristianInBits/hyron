package dev.cristianinbits.hyron.gym.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.gym.domain.GymExerciseEntry;

@Repository
public interface GymExerciseEntryRepository extends JpaRepository<GymExerciseEntry, Long> {
    
    List<GymExerciseEntry> findByGymWorkoutIdOrderByOrderIndex(Long gymWorkoutDetailsId);
}

