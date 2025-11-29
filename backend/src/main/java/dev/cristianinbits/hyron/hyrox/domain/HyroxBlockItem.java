package dev.cristianinbits.hyron.hyrox.domain;

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
@Table(name = "hyrox_block_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HyroxBlockItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Order of the items inside its block.
     */
    @Column(nullable = false)
    private Integer orderIndex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType itemType; // RUN or STATION

    private Integer restBeforeItemSec;

    private Integer restAfterItemSec;

    @ManyToOne(optional = false)
    @JoinColumn(name = "hyrox_block_id")
    private HyroxBlock block;

    @OneToOne(mappedBy = "blockItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private HyroxRunSegment runSegment;

    @OneToOne(mappedBy = "blockItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private HyroxStationEntry stationEntry;
}
