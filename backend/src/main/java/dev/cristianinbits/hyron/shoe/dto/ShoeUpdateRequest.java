package dev.cristianinbits.hyron.shoe.dto;

import dev.cristianinbits.hyron.shoe.domain.ShoeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Request para actualizar (reemplazar) una zapatilla.
 * <p>
 * Estrategia PUT: Se requiere el envío de todos los campos obligatorios.
 * Los campos opcionales (nickname, notes, etc.) que se envíen como null
 * se borrarán (set to null) en la base de datos.
 */
public record ShoeUpdateRequest(

    @NotBlank
    @Size(max = 50)
    String brand,
    
    @NotBlank
    @Size(max = 100)
    String model,
    
    @Size(max = 50)
    String nickname, // Opcional. Si es null -> se borra el nickname actual.
    
    @NotNull // En PUT, no debemos dejar este campo huérfano.
    ShoeType type,

    @Size(max = 500)
    String imageUrl,

    @Size(max = 50)
    String colorway,

    @Size(max = 500)
    String notes,

    @NotNull
    Boolean favorite,

    @NotNull
    @PositiveOrZero
    Integer initialDistanceMeters,
    
    @Positive
    Integer maxDistanceMeters, // Si es null -> se elimina el límite.
    
    @PastOrPresent
    LocalDate purchaseDate,
    
    @NotNull
    Boolean active

) {
    public ShoeUpdateRequest {
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