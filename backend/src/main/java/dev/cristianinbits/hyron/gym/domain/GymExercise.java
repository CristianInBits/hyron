package dev.cristianinbits.hyron.gym.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.BatchSize;

import dev.cristianinbits.hyron.exercise.domain.Exercise;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "gym_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "details_id", nullable = false)
    private GymWorkoutDetails details;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise; // Referencia al Catálogo

    @Column(nullable = false)
    private Integer orderIndex;

    @Column(length = 36)
    private String supersetId; // UUID String para agrupar visualmente

    @Column(length = 1000)
    private String notes; // Notas específicas de hoy

    // Jerarquía Nivel 2 -> Nivel 3
    @OneToMany(mappedBy = "gymExercise", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @BatchSize(size = 50)
    @Builder.Default
    private List<GymSet> sets = new ArrayList<>();

    public void addSet(GymSet set) {
        sets.add(set);
        set.setGymExercise(this);
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        GymExercise that = (GymExercise) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}