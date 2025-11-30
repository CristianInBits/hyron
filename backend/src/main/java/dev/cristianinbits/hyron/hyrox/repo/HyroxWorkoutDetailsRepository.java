package dev.cristianinbits.hyron.hyrox.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.hyrox.domain.HyroxWorkoutDetails;

@Repository
public interface HyroxWorkoutDetailsRepository extends JpaRepository<HyroxWorkoutDetails, Long> {

    Optional<HyroxWorkoutDetails> findByWorkoutId(Long workoutId);
}
