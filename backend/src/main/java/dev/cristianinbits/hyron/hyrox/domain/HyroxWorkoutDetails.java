package dev.cristianinbits.hyron.hyrox.domain;

import java.util.ArrayList;
import java.util.List;

import dev.cristianinbits.hyron.workout.domain.Workout;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
@Table(name = "hyrox_workout_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HyroxWorkoutDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Format of the workout, for example: FULL, HALF, CUSTOM...
     */
    @Column(length = 50)
    private String format;

    @Column(length = 4000)
    private String strategyNotes;

    @OneToOne(optional = false)
    @JoinColumn(name = "workout_id", nullable = false, unique = true)
    private Workout workout;

    @OneToMany(mappedBy = "workoutDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<HyroxBlock> blocks = new ArrayList<>();
}
