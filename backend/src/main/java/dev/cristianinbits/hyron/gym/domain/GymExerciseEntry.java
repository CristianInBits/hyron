package dev.cristianinbits.hyron.gym.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "gym_exercise_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymExerciseEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer orderIndex;

    @Column(nullable = false, length = 255)
    private String exerciseName;

    @Column(length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private MuscleGroup muscleGroup;

    @ManyToOne(optional = false)
    @JoinColumn(name = "gym_workout_details_id")
    private GymWorkoutDetails gymWorkout;

    @OneToMany(mappedBy = "exerciseEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GymSet> sets = new ArrayList<>();
}
