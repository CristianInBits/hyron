package dev.cristianinbits.hyron.run.domain;

import java.util.ArrayList;
import java.util.List;

import dev.cristianinbits.hyron.workout.domain.Workout;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
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
@Table(name = "run_workout_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunWorkoutDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer totalDistance; // meters
    private Integer totalDurationSec; // seconds
    private String averagePace; // e.g. "5:00/km"
    private Integer elevationGain; // meters
    private String surfaceType; // e.g. "TREADMILL", "ROAD"
    private String sessionType; // e.g. "INTERVALS", "EASY", ...

    @OneToOne
    @JoinColumn(name = "workout_id", nullable = false, unique = true)
    private Workout workout;

    @OneToMany(mappedBy = "runWorkout", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RunInterval> intervals = new ArrayList<>();

    @OneToMany(mappedBy = "runWorkout", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RunSplit> splits = new ArrayList<>();
}
