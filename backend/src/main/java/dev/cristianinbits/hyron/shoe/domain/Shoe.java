package dev.cristianinbits.hyron.shoe.domain;

import dev.cristianinbits.hyron.user.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import java.util.Objects;

@Entity
@Table(name = "shoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shoe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(length = 50)
    private String nickname;

    @Builder.Default
    @Column(name = "initial_distance_meters", nullable = false)
    private Integer initialDistanceMeters = 0;

    @Column(name = "max_distance_meters")
    private Integer maxDistanceMeters;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Shoe other = (Shoe) o;
        return getId() != null && Objects.equals(getId(), other.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}