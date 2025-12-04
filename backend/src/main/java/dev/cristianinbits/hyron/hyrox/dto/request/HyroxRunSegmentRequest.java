package dev.cristianinbits.hyron.hyrox.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record HyroxRunSegmentRequest(

    @NotNull
    @Positive
    Integer distance,    // m
    
    @NotNull
    @Positive
    Integer durationSec,    // s

    @Size(max = 20)
    String averagePace,

    @Positive
    @Max(250)
    Integer averageHr,

    @Size(max = 2000)
    String notes
    
) { }
