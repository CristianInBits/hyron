package dev.cristianinbits.hyron.swim.dto;

import java.util.List;

import dev.cristianinbits.hyron.swim.domain.SwimStroke;
import edu.umd.cs.findbugs.annotations.NonNull;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record SwimWorkoutDetailsUpdateRequest(

    @Positive
    Integer totalDistance,

    @Positive
    Integer totalDurationSec,

    String averagePace,

    SwimStroke mainStroke,

    String sessionType,

    List<@Valid SwimSetRequest> sets

) { }
