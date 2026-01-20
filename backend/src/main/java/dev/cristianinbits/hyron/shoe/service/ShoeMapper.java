package dev.cristianinbits.hyron.shoe.service;

import dev.cristianinbits.hyron.shoe.domain.Shoe;
import dev.cristianinbits.hyron.shoe.domain.ShoeType;
import dev.cristianinbits.hyron.shoe.domain.ShoeWearStatus;
import dev.cristianinbits.hyron.shoe.dto.*;

import org.springframework.stereotype.Component;

/**
 * Mapper del dominio Shoes: Entity <-> DTO.
 *
 * <p>
 * Incluye lógica de campos calculados (total/remaining/percent/status) para
 * ShoeResponse.
 * </p>
 */
@Component
public class ShoeMapper {

    private static final double WARNING_AT_PERCENT = 75.0;
    private static final double OVERDUE_AT_PERCENT = 100.0;

    /**
     * Construye una entidad {@link Shoe} a partir de una petición de creación.
     * No asigna el usuario (se hace en el servicio).
     *
     * @param request request de creación
     * @return entidad Shoe lista para persistir
     */
    public Shoe toEntity(ShoeCreateRequest request) {
        Shoe shoe = new Shoe();

        shoe.setBrand(request.brand());
        shoe.setModel(request.model());

        shoe.setNickname(request.nickname());

        shoe.setType(request.type() != null ? request.type() : ShoeType.RUNNING);

        shoe.setImageUrl(request.imageUrl());
        shoe.setColorway(request.colorway());
        shoe.setNotes(request.notes());

        shoe.setFavorite(request.favorite() != null && request.favorite());
        shoe.setActive(request.active() == null || request.active());

        shoe.setPurchaseDate(request.purchaseDate());

        shoe.setInitialDistanceMeters(request.initialDistanceMeters() != null ? request.initialDistanceMeters() : 0);
        shoe.setAccumulatedDistanceMeters(0); // SIEMPRE empieza en 0 al crear
        shoe.setMaxDistanceMeters(request.maxDistanceMeters());

        return shoe;
    }

    /**
     * Aplica un PUT (reemplazo) desde {@link ShoeUpdateRequest} sobre una entidad
     * existente.
     * No modifica: id, user, accumulatedDistanceMeters.
     *
     * @param request datos de reemplazo
     * @param target  entidad a modificar
     */
    public void applyPut(ShoeUpdateRequest request, Shoe target) {
        // Campos obligatorios (protegidos por @NotNull en DTO)
        target.setBrand(request.brand());
        target.setModel(request.model());
        target.setType(request.type());
        target.setFavorite(request.favorite());
        target.setActive(request.active());
        target.setInitialDistanceMeters(request.initialDistanceMeters());

        // Campos opcionales (Nullable)
        // PUT: si request.notes() es null, target.setNotes(null) BORRA el dato.
        target.setNickname(request.nickname());
        target.setImageUrl(request.imageUrl());
        target.setColorway(request.colorway());
        target.setNotes(request.notes());
        target.setPurchaseDate(request.purchaseDate());
        target.setMaxDistanceMeters(request.maxDistanceMeters());// null = "sin límite"

        // NO tocar accumulatedDistanceMeters
    }

    /**
     * Convierte una entidad a response con campos calculados.
     *
     * @param shoe entidad
     * @return response para frontend
     */
    public ShoeResponse toResponse(Shoe shoe) {
        int total = shoe.getTotalDistanceMeters();

        Integer max = shoe.getMaxDistanceMeters();
        Integer remaining = null;
        Integer percent = null;
        ShoeWearStatus status = null;

        if (max != null && max > 0) {
            remaining = max - total;

            double exactPercent = (total * 100.0) / max;
            percent = (int) Math.round(exactPercent);

            if (exactPercent >= OVERDUE_AT_PERCENT)
                status = ShoeWearStatus.OVERDUE;
            else if (exactPercent >= WARNING_AT_PERCENT)
                status = ShoeWearStatus.WARNING;
            else
                status = ShoeWearStatus.OK;
        }

        return new ShoeResponse(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getNickname(),
                shoe.getType(),
                shoe.getImageUrl(),
                shoe.getColorway(),
                shoe.getNotes(),
                shoe.isFavorite(),
                shoe.getPurchaseDate(),
                shoe.isActive(),
                shoe.getInitialDistanceMeters(),
                shoe.getAccumulatedDistanceMeters(),
                shoe.getMaxDistanceMeters(),
                total,
                remaining,
                percent,
                status
            );
    }
}