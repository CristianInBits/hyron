package dev.cristianinbits.hyron.shoe.service;

import java.util.List;

import dev.cristianinbits.hyron.shoe.dto.ShoeCreateRequest;
import dev.cristianinbits.hyron.shoe.dto.ShoeResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeSummaryResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeUpdateRequest;

public interface ShoeService {
    ShoeResponse createShoe(Long userId, ShoeCreateRequest request);

    ShoeResponse getShoe(Long userId, Long shoeId);

    List<ShoeResponse> getAllShoes(Long userId);

    List<ShoeSummaryResponse> getActiveShoes(Long userId);

    ShoeResponse updateShoe(Long userId, Long shoeId, ShoeUpdateRequest request);

    void deleteShoe(Long userId, Long shoeId);
}