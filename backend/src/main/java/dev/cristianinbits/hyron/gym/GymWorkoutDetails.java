package dev.cristianinbits.hyron.gym;

import java.util.ArrayList;
import java.util.List;

import dev.cristianinbits.hyron.workout.domain.Workout;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    private String goal;

    @Enumerated(EnumType.STRING)
    private MuscleGroup mainMuscleGroup;

    /**
     * Total volume of the session (for example, total reps * weight).
     */
    private Integer totalVolume;

    @OneToOne
    @JoinColumn(name = "workout_id", nullable = false, unique = true)
    private Workout workout;

    @OneToMany(mappedBy = "gymWorkout", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GymExerciseEntry> exercises = new ArrayList<>();
}
