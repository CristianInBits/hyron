package dev.cristianinbits.hyron.shoe.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.shoe.domain.Shoe;
import dev.cristianinbits.hyron.shoe.dto.ShoeCreateRequest;
import dev.cristianinbits.hyron.shoe.dto.ShoeResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeSummaryResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeUpdateRequest;
import dev.cristianinbits.hyron.shoe.repo.ShoeRepository;
import dev.cristianinbits.hyron.user.domain.User;
import dev.cristianinbits.hyron.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ShoeServiceImpl implements ShoeService {

    private final ShoeRepository shoeRepository;
    private final UserRepository userRepository;

    @Override
    public ShoeResponse createShoe(Long userId, ShoeCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Shoe shoe = Shoe.builder()
                .user(user)
                .brand(request.brand())
                .model(request.model())
                .nickname(request.nickname())
                .initialDistanceMeters(request.initialDistanceMeters())
                .maxDistanceMeters(request.maxDistanceMeters())
                .active(true)
                .build();

        Shoe saved = shoeRepository.save(shoe);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ShoeResponse getShoe(Long userId, Long shoeId) {
        Shoe shoe = shoeRepository.findByIdAndUserId(shoeId, userId)
                .orElseThrow(() -> new NotFoundException("Shoe not found"));
        return toResponse(shoe);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShoeResponse> getAllShoes(Long userId) {
        return shoeRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShoeSummaryResponse> getActiveShoes(Long userId) {
        return shoeRepository.findByUserIdAndActiveTrue(userId).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Override
    public ShoeResponse updateShoe(Long userId, Long shoeId, ShoeUpdateRequest request) {
        Shoe shoe = shoeRepository.findByIdAndUserId(shoeId, userId)
                .orElseThrow(() -> new NotFoundException("Shoe not found"));

        if (request.brand() != null) shoe.setBrand(request.brand());
        if (request.model() != null) shoe.setModel(request.model());
        if (request.nickname() != null) shoe.setNickname(request.nickname());
        if (request.initialDistanceMeters() != null) shoe.setInitialDistanceMeters(request.initialDistanceMeters());
        if (request.maxDistanceMeters() != null) shoe.setMaxDistanceMeters(request.maxDistanceMeters());
        if (request.active() != null) shoe.setActive(request.active());

        Shoe saved = shoeRepository.save(shoe);
        return toResponse(saved);
    }

    @Override
    public void deleteShoe(Long userId, Long shoeId) {
        if (!shoeRepository.existsByIdAndUserId(shoeId, userId)) {
            throw new NotFoundException("Shoe not found");
        }
        shoeRepository.deleteById(shoeId);
    }

    // ==================== Mappers ====================

    private ShoeResponse toResponse(Shoe shoe) {
        Long total = shoeRepository.getTotalDistanceMeters(shoe.getId());
        
        if (total == null)
            total = (long) shoe.getInitialDistanceMeters();

        Integer percentage = null;
        if (shoe.getMaxDistanceMeters() != null && shoe.getMaxDistanceMeters() > 0) {
            percentage = (int) ((total * 100) / shoe.getMaxDistanceMeters());
        }

        return new ShoeResponse(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getNickname(),
                shoe.isActive(),
                shoe.getInitialDistanceMeters(),
                shoe.getMaxDistanceMeters(),
                total,
                percentage
        );
    }

    private ShoeSummaryResponse toSummaryResponse(Shoe shoe) {
        return new ShoeSummaryResponse(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getNickname()
        );
    }
}