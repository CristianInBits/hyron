package dev.cristianinbits.hyron.run.domain;

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
@Table(name = "run_splits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer kilometer; // 1, 2, 3, ...

    private Integer timeSec; // seconds for that km

    private String pace; // formatted pace string

    private Integer averageHr;

    @ManyToOne(optional = false)
    @JoinColumn(name = "run_workout_details_id")
    private RunWorkoutDetails runWorkout;
}
