package dev.cristianinbits.hyron.swim.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.swim.domain.SwimSet;

@Repository
public interface SwimSetRepository extends JpaRepository<SwimSet, Long> {

    List<SwimSet> findBySwimWorkoutIdOrderByOrderIndex(Long swimWorkoutDetailsId);
}
