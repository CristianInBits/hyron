package dev.cristianinbits.hyron.swim.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "swim_sets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SwimSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer orderIndex;

    private Integer repetitions;

    private Integer distancePerRep; // meters

    private String targetPace; // e.g. "1:45/100m"

    private Integer totalBlockTimeSec; // seconds

    private Integer restBetweenRepsSec; // seconds

    @Column(length = 2000)
    private String notes;

    @ManyToOne(optional = false)
    @JoinColumn(name = "swim_workout_deatils_id")
    private SwimWorkoutDetails swimWorkout;

    @Enumerated(EnumType.STRING)
    private SwinStroke stroke;
}
