package dev.cristianinbits.hyron.hyrox.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hyrox_station_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HyroxStationEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HyroxStation station;

    /**
     * Duration of the station (seconds).
     */
    private Integer durationSec;

    private Integer rpe;

    private Integer reps;

    /**
     * Distance covered in this station (if applies, meters)
     */
    private Integer distance;

    /**
     * Total weight moved (kg).
     */
    private Float totalWeight;

    /**
     * Average power (wats).
     */
    private Integer averagePower;

    /**
     * Average heart rate (bpm).
     */
    private Integer averageHr;

    @Column(length = 2000)
    private String notes;

    @OneToOne
    @JoinColumn(name = "block_item_id", nullable = false, unique = true)
    private HyroxBlockItem blockItem;
}
