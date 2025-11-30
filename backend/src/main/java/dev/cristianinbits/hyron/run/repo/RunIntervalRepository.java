package dev.cristianinbits.hyron.run.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.run.domain.RunInterval;

@Repository
public interface RunIntervalRepository extends JpaRepository<RunInterval, Long> {

    List<RunInterval> findByRunWorkoutIdOrderByOrderIndex(Long runWorkoutDetailsId);
}
