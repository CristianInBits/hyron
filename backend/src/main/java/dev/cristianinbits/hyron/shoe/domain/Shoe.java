package dev.cristianinbits.hyron.shoe.domain;

import dev.cristianinbits.hyron.user.domain.User;

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
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Objects;

import org.hibernate.Hibernate;

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

    /**
     * Propietario de la zapatilla.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(length = 50)
    private String nickname;

    /**
     * Tipo principal de la zapatilla para filtrado y UX.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ShoeType type = ShoeType.RUNNING;

    /**
     * URL de imagen (externa o interna). Opcional.
     */
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    /**
     * Variante de color / edición para distinguir modelos repetidos. Opcional.
     */
    @Column(length = 50)
    private String colorway;

    /**
     * Notas libres para el usuario. Opcional.
     */
    @Column(length = 500)
    private String notes;

    /**
     * Marcada como favorita para selección rápida. Por defecto false.
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean favorite = false;

    /**
     * Distancia previa a registrar la zapatilla en la app (lo que ya llevaba
     * acumulado).
     */
    @Builder.Default
    @Column(name = "initial_distance_meters", nullable = false)
    private int initialDistanceMeters = 0;

    /**
     * Distancia acumulada dentro de la app (se actualiza cuando se registran
     * entrenos).
     */
    @Builder.Default
    @Column(name = "accumulated_distance_meters", nullable = false)
    private int accumulatedDistanceMeters = 0;

    /**
     * Distancia máxima recomendada. Si es null, no hay límite definido.
     */
    @Column(name = "max_distance_meters")
    private Integer maxDistanceMeters;

    /**
     * Fecha de compra (opcional).
     */
    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    /**
     * Control simple de visibilidad/uso en formularios. Por defecto true.
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    /**
     * Distancia total (no persistida): initial + accumulated.
     *
     * @return distancia total en metros.
     */
    @Transient
    public int getTotalDistanceMeters() {
        return initialDistanceMeters + accumulatedDistanceMeters;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        Shoe other = (Shoe) o;
        return getId() != null && Objects.equals(getId(), other.getId());
    }

    @Override
    public final int hashCode() {
        return Hibernate.getClass(this).hashCode();
    }
}