package dev.cristianinbits.hyron.exercise.domain;

import dev.cristianinbits.hyron.gym.domain.MuscleGroup;
import dev.cristianinbits.hyron.user.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import java.util.Objects;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "muscle_group", nullable = false, length = 20)
    private MuscleGroup muscleGroup;

    @Column(length = 255)
    private String notes;

    @Builder.Default
    @Column(name = "is_unilateral", nullable = false)
    private boolean isUnilateral = false;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Exercise exercise = (Exercise) o;
        return getId() != null && Objects.equals(getId(), exercise.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}