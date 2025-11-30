package dev.cristianinbits.hyron.hyrox.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.cristianinbits.hyron.hyrox.domain.HyroxStationEntry;

@Repository
public interface HyroxStationEntryRepository extends JpaRepository<HyroxStationEntry, Long> {

    Optional<HyroxStationEntry> findByBlockItemId(Long blockItemId);
}
