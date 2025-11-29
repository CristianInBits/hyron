package dev.cristianinbits.hyron.swim;

import java.util.ArrayList;
import java.util.List;

import dev.cristianinbits.hyron.workout.Workout;
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
@Table(name = "swim_workout_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SwimWorkoutDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer totalDistance; // meters
    private Integer totalDurationSec; // seconds
    private String averagePace; // e.g. "1:50/100m"

    @Enumerated(EnumType.STRING)
    private SwinStroke mainStroke;

    private String sessionType; // e.g. "TECHNIQUE", "ENDURANCE"

    @OneToOne
    @JoinColumn(name = "workout_id", nullable = false, unique = true)
    private Workout workout;

    @OneToMany(mappedBy = "swimWorkout", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SwimSet> sets = new ArrayList<>();

}
