package dev.cristianinbits.hyron.hyrox.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.hyrox.domain.HyroxBlockItem;

@Repository
public interface HyroxBlockItemRepository extends JpaRepository<HyroxBlockItem, Long> {

    List<HyroxBlockItem> findByBlockIdOrderByOrderIndex(Long blockId);
}
