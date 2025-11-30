package dev.cristianinbits.hyron.swim.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.swim.domain.SwimWorkoutDetails;

@Repository
public interface SwimWorkoutDetailsRepository extends JpaRepository<SwimWorkoutDetails, Long> {

    Optional<SwimWorkoutDetails> findByWorkoutId(Long workoutId);
}
