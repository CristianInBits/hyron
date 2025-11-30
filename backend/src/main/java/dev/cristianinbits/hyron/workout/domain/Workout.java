package dev.cristianinbits.hyron.workout.domain;

import java.time.LocalDateTime;

import dev.cristianinbits.hyron.gym.GymWorkoutDetails;
import dev.cristianinbits.hyron.hyrox.domain.HyroxWorkoutDetails;
import dev.cristianinbits.hyron.run.domain.RunWorkoutDetails;
import dev.cristianinbits.hyron.swim.domain.SwimWorkoutDetails;
import dev.cristianinbits.hyron.user.domain.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

@Entity
@Table(name = "workouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkoutType type;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    /**
     * Global RPE of the sesion (1-10)
     */
    private Integer globalRpe;

    @Column(length = 4000)
    private String notes;

    private String location;

    /**
     * Source of the workout data (e.g. "MANUAL", "GARMIN", "STRAVA")
     */
    private String source;

    // --- relationships ---

    @ManyToOne(optional = false)
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
}
