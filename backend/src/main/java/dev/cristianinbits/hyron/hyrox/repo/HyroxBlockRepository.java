package dev.cristianinbits.hyron.hyrox.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.hyrox.domain.HyroxBlock;

@Repository
public interface HyroxBlockRepository extends JpaRepository<HyroxBlock, Long> {

    List<HyroxBlock> findByWorkoutDetailsIdOrderByOrderIndex(Long hyroxWorkoutDetailsId);
}
