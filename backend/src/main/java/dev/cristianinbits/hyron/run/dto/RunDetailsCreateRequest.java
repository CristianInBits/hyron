package dev.cristianinbits.hyron.run.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record RunDetailsCreateRequest(
        
    @Positive
    Integer totalDistanceMeters,

    @PositiveOrZero
    Integer totalElevationGain,
    
    @Positive
    Integer averageHr,
    
    @Positive
    Long shoeId,
    
    @Size(max = 4000)
    String notes,

    @NotEmpty(message = "At least one interval is required (e.g. the full run)") 
    @Valid 
    List<RunIntervalRequest> intervals

) {
    public RunDetailsCreateRequest {
        if (notes != null)
            notes = notes.trim();
        if (intervals == null) 
            intervals = List.of();
    }
}