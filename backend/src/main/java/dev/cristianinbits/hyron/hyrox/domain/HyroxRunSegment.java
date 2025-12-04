package dev.cristianinbits.hyron.hyrox.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hyrox_run_segments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HyroxRunSegment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Distance of the segment (meters).
     */
    @Column(nullable = false)
    private Integer distance;
    
    /**
     * Duration of the segment (seconds)
    */
    @Column(nullable = false)
    private Integer durationSec;

    /**
     * Average pace as a formatted string (e.g. "4:30/km")
     */
    @Column(length = 20)
    private String averagePace;

    /**
     * Average heart rate (bpm).
     */
    private Integer averageHr;

    @Column(length = 2000)
    private String notes;

    @OneToOne(optional = false)
    @JoinColumn(name = "block_item_id", nullable = false, unique = true)
    private HyroxBlockItem blockItem;
}
