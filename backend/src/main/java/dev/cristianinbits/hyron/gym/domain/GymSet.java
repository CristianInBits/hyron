package dev.cristianinbits.hyron.gym.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import java.util.Objects;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_exercise_id", nullable = false)
    private GymExercise gymExercise;

    @Column(nullable = false)
    private Integer orderIndex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GymSetType type;

    @Builder.Default
    @Column(name = "weight_kg", nullable = false)
    private Double weightKg = 0.0;

    @Column(name = "reps")
    private Integer reps;

    @Column(name = "rpe")
    private Double rpe; // Double porque a veces es 8.5

    @Column(name = "rest_seconds")
    private Integer restSeconds;
    
    // Opcional, por si quieres registrar duración de la serie (Time Under Tension)
    @Column(name = "execution_seconds")
    private Integer executionSeconds; 

    @Column(length = 500)
    private String notes;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        GymSet gymSet = (GymSet) o;
        return getId() != null && Objects.equals(getId(), gymSet.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}