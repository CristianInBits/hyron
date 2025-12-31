package dev.cristianinbits.hyron.gym.domain;

import dev.cristianinbits.hyron.workout.domain.Workout;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "gym_workout_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymWorkoutDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false, unique = true)
    private Workout workout;

    @Column(length = 4000)
    private String notes;

    // Jerarquía Nivel 1 -> Nivel 2
    @OneToMany(mappedBy = "details", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @BatchSize(size = 50)
    @Builder.Default
    private List<GymExercise> exercises = new ArrayList<>();

    public void addExercise(GymExercise exercise) {
        exercises.add(exercise);
        exercise.setDetails(this);
    }

    // Equals/HashCode Manual
    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        GymWorkoutDetails that = (GymWorkoutDetails) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}