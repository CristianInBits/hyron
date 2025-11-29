package dev.cristianinbits.hyron.run.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "run_intervals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunInterval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Type of interval (e.g. "WORK", "REST", "WARMUP", "COOLDOWN").
     */
    private String type;

    @Column(nullable = false)
    private Integer orderIndex;

    private Integer distance; // meters (optional)
    private Integer durationSec; // planned duration (seconds)
    private Integer timeSec; // actual time (seconds)

    private String averagePace;
    private Integer averageHr;
    private Integer rpe;

    @Column(length = 2000)
    private String notes;

    @ManyToOne(optional = false)
    @JoinColumn(name = "run_workout_details_id")
    private RunWorkoutDetails runWorkout;
}
