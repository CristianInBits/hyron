package dev.cristianinbits.hyron.gym.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.gym.domain.GymSet;

@Repository
public interface GymSetRepository extends JpaRepository<GymSet, Long> {

    List<GymSet> findByExerciseEntryIdOrderBySetNumber(Long exerciseEntryId);
}
