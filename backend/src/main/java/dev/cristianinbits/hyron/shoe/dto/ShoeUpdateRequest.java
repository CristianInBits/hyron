package dev.cristianinbits.hyron.shoe.dto;

import dev.cristianinbits.hyron.common.validation.NullOrNotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ShoeUpdateRequest(

    @NullOrNotBlank
    @Size(max = 50)
    String brand,

    @NullOrNotBlank
    @Size(max = 100)
    String model,

    @Size(max = 50)
    String nickname,

    @PositiveOrZero
    Integer initialDistanceMeters,

    @Positive
    Integer maxDistanceMeters,

    Boolean active

) {
    public ShoeUpdateRequest {
        if (brand != null)
            brand = brand.trim();
        
        if (model != null)
            model = model.trim();

        if (nickname != null)
            nickname = nickname.trim();
    }
}