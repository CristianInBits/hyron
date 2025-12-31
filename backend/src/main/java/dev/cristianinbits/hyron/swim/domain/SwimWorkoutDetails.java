package dev.cristianinbits.hyron.swim.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.hibernate.Hibernate;
import org.hibernate.annotations.BatchSize;

import dev.cristianinbits.hyron.workout.domain.Workout;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "swim_workout_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SwimWorkoutDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false, unique = true)
    private Workout workout;

    @Enumerated(EnumType.STRING)
    @Column(name = "pool_type", length = 20)
    private PoolType poolType;

    @Column(name = "total_distance_meters")
    private Integer totalDistanceMeters;

    @Column(name = "total_time_seconds")
    private Integer totalTimeSeconds;

    @Column(length = 4000)
    private String notes;

    @OneToMany(mappedBy = "swimDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @BatchSize(size = 50)
    @Builder.Default
    private List<SwimInterval> intervals = new ArrayList<>();

    public void addInterval(SwimInterval interval) {
        intervals.add(interval);
        interval.setSwimDetails(this);
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SwimWorkoutDetails other = (SwimWorkoutDetails) o;
        return getId() != null && Objects.equals(getId(), other.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}