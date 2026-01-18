package dev.cristianinbits.hyron.shoe.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;
import dev.cristianinbits.hyron.shoe.domain.Shoe;
import dev.cristianinbits.hyron.shoe.dto.ShoeSummaryResponse;

@Repository
public interface ShoeRepository extends JpaRepository<Shoe, Long> {
    
    List<Shoe> findByUserIdAndActiveTrue(Long userId);

    List<Shoe> findByUserId(Long userId);

    Optional<Shoe> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    @Query("""
            SELECT COALESCE(SUM(r.totalDistanceMeters), 0)
            FROM RunWorkoutDetails r
            WHERE r.shoe.id = :shoeId
            """)
    Long getAccumulatedDistanceMeters(@Param("shoeId") Long shoeId);
    
    @Query("""
            SELECT s.initialDistanceMeters
              + COALESCE((SELECT SUM(r.totalDistanceMeters) FROM RunWorkoutDetails r WHERE r.shoe = s), 0)
              + COALESCE((SELECT SUM(i.distanceMeters)
                          FROM HyroxItem i
                          WHERE i.station = :station
                            AND i.block.details.shoe = s), 0)
            FROM Shoe s
            WHERE s.id = :shoeId
            """)
    Long getTotalDistanceMeters(@Param("shoeId") Long shoeId, @Param("station") HyroxStation station);

    @Query("""
            SELECT s,
              (s.initialDistanceMeters
               + COALESCE((SELECT SUM(r.totalDistanceMeters) FROM RunWorkoutDetails r WHERE r.shoe = s), 0)
               + COALESCE((SELECT SUM(i.distanceMeters)
                           FROM HyroxItem i
                           WHERE i.station = :station
                             AND i.block.details.shoe = s), 0)
              ) as totalDist
            FROM Shoe s
            WHERE s.user.id = :userId
            ORDER BY totalDist DESC
            """)
    List<Object[]> findAllWithTotalDistance(@Param("userId") Long userId, @Param("station") HyroxStation station);
    
    List<Shoe> findByUserIdAndActiveOrderByInitialDistanceMetersDesc(Long userId, Boolean active);

    @Query("""
            SELECT s,
              (s.initialDistanceMeters
               + COALESCE((SELECT SUM(r.totalDistanceMeters) FROM RunWorkoutDetails r WHERE r.shoe = s), 0)
               + COALESCE((SELECT SUM(i.distanceMeters)
                           FROM HyroxItem i
                           WHERE i.station = :station
                             AND i.block.details.shoe = s), 0)
              ) as totalDist
            FROM Shoe s
            WHERE s.user.id = :userId AND s.active = true
            ORDER BY totalDist DESC
            """)
    List<Object[]> findTopActiveShoesByDistance(@Param("userId") Long userId, @Param("station") HyroxStation station, Pageable pageable);

    /*Image aún no existe en tu entidad, pasamos null */
    @Query("""
        SELECT new dev.cristianinbits.hyron.shoe.dto.ShoeSummaryResponse(
            s.id,
            s.brand,
            s.model,
            s.nickname,
            null, 
            CAST(
                (s.initialDistanceMeters
                + COALESCE((SELECT SUM(r.totalDistanceMeters) FROM RunWorkoutDetails r WHERE r.shoe = s), 0)
                + COALESCE((SELECT SUM(i.distanceMeters) 
                            FROM HyroxItem i 
                            WHERE i.station = :station 
                              AND i.block.details.shoe = s), 0)
                ) AS long
            ),
            s.maxDistanceMeters
        )
        FROM Shoe s
        WHERE s.user.id = :userId 
          AND s.active = true
        ORDER BY s.initialDistanceMeters DESC
    """)
    List<ShoeSummaryResponse> findActiveShoeSummaries(
            @Param("userId") Long userId, 
            @Param("station") HyroxStation station
    );
}