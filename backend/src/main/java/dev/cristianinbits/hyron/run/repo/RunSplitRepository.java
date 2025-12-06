package dev.cristianinbits.hyron.run.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.run.domain.RunSplit;

@Repository
public interface RunSplitRepository extends JpaRepository<RunSplit, Long> {

    List<RunSplit> findByRunWorkoutIdOrderByKilometer(Long runWorkoutDetailsId);
}
