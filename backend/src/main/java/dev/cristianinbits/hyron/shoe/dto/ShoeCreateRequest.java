package dev.cristianinbits.hyron.shoe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ShoeCreateRequest(

    @NotBlank
    @Size(max = 50)
    String brand,

    @NotBlank
    @Size(max = 100)
    String model,

    @Size(max = 50)
    String nickname,

    @PositiveOrZero
    Integer initialDistanceMeters,

    @Positive
    Integer maxDistanceMeters

) {
    public ShoeCreateRequest {
        if (brand != null) 
            brand = brand.trim();

        if (model != null) 
            model = model.trim();

        if (nickname != null) 
            nickname = nickname.trim();
        
        if (initialDistanceMeters == null) 
            initialDistanceMeters = 0;
    }
}