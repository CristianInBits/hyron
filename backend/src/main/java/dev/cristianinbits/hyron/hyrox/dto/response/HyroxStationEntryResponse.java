package dev.cristianinbits.hyron.hyrox.dto.response;

import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;

public record HyroxStationEntryResponse(
        Long id,
        HyroxStation station,
        Integer durationSec,
        Integer rpe,
        Integer reps,
        Integer distance,     // m (opcional)
        Float totalWeight,    // kg
        Integer averagePower, // W
        Integer averageHr,
        String notes
) { }