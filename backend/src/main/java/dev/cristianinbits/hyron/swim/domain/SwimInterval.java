package dev.cristianinbits.hyron.swim.domain;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.hibernate.Hibernate;

import dev.cristianinbits.hyron.swim.helper.SwimEquipmentConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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
@Table(name = "swim_intervals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SwimInterval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "swim_details_id", nullable = false)
    private SwimWorkoutDetails swimDetails;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SwimIntervalType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SwimStroke stroke;

    @Column(name = "distance_meters")
    private Integer distanceMeters;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    private Integer rpe;

    @Convert(converter = SwimEquipmentConverter.class)
    @Column(length = 200)
    @Builder.Default
    private Set<SwimEquipment> equipment = new HashSet<>();

    @Column(length = 4000)
    private String notes;

    @Override
    public final boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        SwimInterval other = (SwimInterval) o;
        return getId() != null && Objects.equals(getId(), other.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}