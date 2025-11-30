package dev.cristianinbits.hyron.run.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.run.domain.RunWorkoutDetails;

@Repository
public interface RunWorkoutDetailsRepository extends JpaRepository<RunWorkoutDetails, Long> {

    Optional<RunWorkoutDetails> findByWorkoutId(Long workoutId);
}
