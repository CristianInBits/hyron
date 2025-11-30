package dev.cristianinbits.hyron.workout.repo;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    List<Workout> findByUserId(Long userId);

    List<Workout> findByUserIdAndType(Long userId, WorkoutType type);

    List<Workout> findByUserIdAndStartDateTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
