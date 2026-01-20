package dev.cristianinbits.hyron.shoe.dto;

import java.time.LocalDate;
import dev.cristianinbits.hyron.shoe.domain.ShoeType;
import dev.cristianinbits.hyron.shoe.domain.ShoeWearStatus;

/**
 * DTO de salida para mostrar información de una zapatilla en el frontend.
 * <p>
 * Incluye campos persistidos y campos calculados (no almacenados en BD).
 *
 * @param id identificador de la zapatilla
 * @param brand marca
 * @param model modelo
 * @param nickname apodo opcional
 * @param type tipo para filtros
 * @param imageUrl URL de imagen opcional
 * @param colorway variante de color opcional
 * @param notes notas opcionales
 * @param favorite si está marcada como favorita
 * @param purchaseDate fecha de compra opcional
 * @param active si está activa
 * @param initialDistanceMeters distancia previa en metros
 * @param accumulatedDistanceMeters distancia acumulada en la app en metros
 * @param maxDistanceMeters distancia máxima recomendada en metros (opcional)
 * @param totalDistanceMeters total en metros (initial + accumulated)
 * @param remainingDistanceMeters metros restantes (max - total) si hay max; null si no hay límite
 * @param usagePercent porcentaje de uso (total/max * 100) si hay max; null si no hay límite
 * @param status estado de desgaste si hay max; null si no hay límite
 */
public record ShoeResponse(
    Long id,
    String brand,
    String model,
    String nickname,
    ShoeType type,
    String imageUrl,
    String colorway,
    String notes,
    boolean favorite,
    LocalDate purchaseDate,
    boolean active,
    int initialDistanceMeters,
    int accumulatedDistanceMeters,
    Integer maxDistanceMeters,
    int totalDistanceMeters,
    Integer remainingDistanceMeters,
    Integer usagePercent,
    ShoeWearStatus status
) {}