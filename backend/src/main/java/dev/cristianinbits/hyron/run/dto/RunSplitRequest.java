package dev.cristianinbits.hyron.run.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record RunSplitRequest(

        @Positive
        Integer kilometer,

        @Positive
        Integer timeSec,      // s

        @Size(max = 20)
        String pace,

        @PositiveOrZero
        Integer averageHr
) {
}
