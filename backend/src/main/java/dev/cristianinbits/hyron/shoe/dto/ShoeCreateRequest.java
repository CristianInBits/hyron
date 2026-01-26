package dev.cristianinbits.hyron.shoe.dto;

import java.time.LocalDate;

import dev.cristianinbits.hyron.shoe.domain.ShoeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
//import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * Request para crear una zapatilla.
 *
 * <p>Campos opcionales pueden omitirse (null). La capa de servicio debe aplicar defaults:
 * <ul>
 * <li>type -> ShoeType.RUNNING si null</li>
 * <li>initialDistanceMeters -> 0 si null</li>
 * <li>maxDistanceMeters -> null (sin límite) si null</li>
 * <li>favorite -> false si null</li>
 * <li>active -> true si null</li>
 * </ul>
 */
public record ShoeCreateRequest(

    @NotBlank
    @Size(max = 50)
    String brand,

    @NotBlank
    @Size(max = 100)
    String model,

    @Size(max = 50)
    String nickname,

    // Opcional (Default: RUNNING)
    ShoeType type,

    @Size(max = 500)
    String imageUrl,

    @Size(max = 50)
    String colorway,

    @Size(max = 500)
    String notes,

    @NotNull
    Boolean favorite,

    @PositiveOrZero
    Integer initialDistanceMeters,

    @Positive
    Integer maxDistanceMeters,

    @PastOrPresent
    LocalDate purchaseDate,

    @NotNull
    Boolean active

) {
    // Constructor compacto para normalización de datos
    public ShoeCreateRequest {
        if (brand != null) brand = brand.trim();
        if (model != null) model = model.trim();
        
        // Normalización: trim y conversión de vacío a null
        nickname = normalizeString(nickname);
        imageUrl = normalizeString(imageUrl);
        colorway = normalizeString(colorway);
        notes = normalizeString(notes);
    }

    // Helper privado para evitar repetir lógica dentro del constructor
    private static String normalizeString(String input) {
        if (input == null) return null;
        String trimmed = input.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}