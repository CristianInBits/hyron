package dev.cristianinbits.hyron.workout.domain;

import dev.cristianinbits.hyron.gym.domain.GymWorkoutDetails;
import dev.cristianinbits.hyron.hyrox.domain.HyroxWorkoutDetails;
import dev.cristianinbits.hyron.run.domain.RunWorkoutDetails;
import dev.cristianinbits.hyron.swim.domain.SwimWorkoutDetails;
import dev.cristianinbits.hyron.user.domain.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.Objects;

import org.hibernate.Hibernate;

@Entity
@Table(name = "workouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @ToString.Include
    private WorkoutType type;

    @Column(nullable = false)
    private Instant startDateTime;

    private Instant endDateTime;

    private Integer globalRpe;

    @Column(length = 4000)
    private String notes;

    @Column(length = 255)
    private String location;

    @Column(length = 255)
    private String source;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private HyroxWorkoutDetails hyroxDetails;

    @OneToOne(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private RunWorkoutDetails runDetails;

    @OneToOne(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private SwimWorkoutDetails swimDetails;
    
    @OneToOne(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private GymWorkoutDetails gymDetails;

    public void setHyroxDetails(HyroxWorkoutDetails details) {
        if (this.hyroxDetails != null) {
            this.hyroxDetails.setWorkout(null);
        }
        this.hyroxDetails = details;
        if (details != null) {
            details.setWorkout(this);
        }
    }

    public void setRunDetails(RunWorkoutDetails details) {
        if (this.runDetails != null) {
            this.runDetails.setWorkout(null);
        }
        this.runDetails = details;
        if (details != null) {
            details.setWorkout(this);
        }
    }

    public void setSwimDetails(SwimWorkoutDetails details) {
        if (this.swimDetails != null) {
            this.swimDetails.setWorkout(null);
        }
        this.swimDetails = details;
        if (details != null) {
            details.setWorkout(this);
        }
    }

    public void setGymDetails(GymWorkoutDetails details) {
        if (this.gymDetails != null) {
            this.gymDetails.setWorkout(null);
        }
        this.gymDetails = details;
        if (details != null) {
            details.setWorkout(this);
        }
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Workout other = (Workout) o;
        return getId() != null && Objects.equals(getId(), other.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}