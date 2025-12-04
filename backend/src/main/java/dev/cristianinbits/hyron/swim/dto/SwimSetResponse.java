package dev.cristianinbits.hyron.swim.dto;

import dev.cristianinbits.hyron.swim.domain.SwimStroke;

public record SwimSetResponse(

    Long id,
    Integer orderIndex,
    Integer repetitions,
    Integer distancePerRep,
    String targetPace,
    Integer totalBlockTimeSec,
    Integer restBetweenRepsSec,
    String notes,
    SwimStroke stroke
    
) {}
