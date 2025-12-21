package dev.cristianinbits.hyron.hyrox.dto;

import java.math.BigDecimal;

import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record HyroxItemRequest(

    @NotNull
    HyroxStation station,

    @NotNull
    @Positive
    Integer duration,

    @PositiveOrZero
    Integer recoveryDuration,

    @Positive
    Integer distance,

    @Positive
    Integer reps,

    @Positive
    BigDecimal weight,

    @Positive
    Integer averageHr,

    @Min(1)
    @Max(10)
    Integer rpe,

    @Size(max = 4000)
    String notes

) {
    @AssertTrue(message = "Distance is required for this station type")
    public boolean isDistanceValid() {
        return !isDistanceStation() || distance != null;
    }

    @AssertTrue(message = "Weight is required for this station type")
    public boolean isWeightValid() {
        return !isWeightedStation() || weight != null;
    }

    @AssertTrue(message = "Reps are required for WALL_BALLS")
    public boolean isRepsValid() {
        return station != HyroxStation.WALL_BALLS || reps != null;
    }

    private boolean isDistanceStation() {
        return station == HyroxStation.RUN
                || station == HyroxStation.SKI_ERG
                || station == HyroxStation.ROW
                || station == HyroxStation.SLED_PUSH
                || station == HyroxStation.SLED_PULL
                || station == HyroxStation.FARMERS_CARRY
                || station == HyroxStation.SANDBAG_LUNGES
                || station == HyroxStation.BURPEE_BROAD_JUMP;
    }

    private boolean isWeightedStation() {
        return station == HyroxStation.SLED_PUSH
                || station == HyroxStation.SLED_PULL
                || station == HyroxStation.FARMERS_CARRY
                || station == HyroxStation.SANDBAG_LUNGES
                || station == HyroxStation.WALL_BALLS;
    }
}