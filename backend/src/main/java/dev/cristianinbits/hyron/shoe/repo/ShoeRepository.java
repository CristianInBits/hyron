package dev.cristianinbits.hyron.shoe.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.cristianinbits.hyron.shoe.domain.Shoe;

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
            SELECT s.initialDistanceMeters + COALESCE(SUM(r.totalDistanceMeters), 0)
            FROM Shoe s
            LEFT JOIN RunWorkoutDetails r ON r.shoe.id = s.id
            WHERE s.id = :shoeId
            GROUP BY s.id
            """)
    Long getTotalDistanceMeters(@Param("shoeId") Long shoeId);
    
    List<Shoe> findByUserIdAndActiveOrderByInitialDistanceMetersDesc(Long userId, Boolean active);

    @Query("""
            SELECT s, (s.initialDistanceMeters + COALESCE(SUM(r.totalDistanceMeters), 0)) as totalDist
            FROM Shoe s
            LEFT JOIN RunWorkoutDetails r ON r.shoe = s
            WHERE s.user.id = :userId AND s.active = true
            GROUP BY s
            ORDER BY totalDist DESC
            """)
    List<Object[]> findTopActiveShoesByDistance(@Param("userId") Long userId, Pageable pageable);
}