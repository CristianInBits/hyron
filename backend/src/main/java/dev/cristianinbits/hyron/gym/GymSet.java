package dev.cristianinbits.hyron.gym;

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
@Table(name = "gym_sets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer setNumber;

    private Integer reps;

    private Float weight; // kg

    private Integer rpe;

    private Integer restAfterSetSec; // seconds

    private Boolean completed;

    @ManyToOne(optional = false)
    @JoinColumn(name = "gym_exercise_entry_id")
    private GymExerciseEntry exerciseEntry;
}
