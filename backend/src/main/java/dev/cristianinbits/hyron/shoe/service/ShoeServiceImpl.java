package dev.cristianinbits.hyron.shoe.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;
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
@Transactional(readOnly = true)
public class ShoeServiceImpl implements ShoeService {

    private final ShoeRepository shoeRepository;
    private final UserRepository userRepository;

    @Override
    public List<ShoeResponse> getAllShoes(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found");
        }

        return shoeRepository.findAllWithTotalDistance(userId, HyroxStation.RUN).stream()
                .map(row -> {
                    Shoe shoe = (Shoe) row[0];
                    Long total = (Long) row[1];
                    return toResponse(shoe, total);
                })
                .toList();
    }

    @Override
    public List<ShoeSummaryResponse> getActiveShoesForSelect(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found");
        }

        return shoeRepository.findByUserIdAndActiveTrue(userId).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Override
    public ShoeResponse getShoe(Long userId, Long shoeId) {
        Shoe shoe = shoeRepository.findByIdAndUserId(shoeId, userId)
                .orElseThrow(() -> new NotFoundException("Shoe not found"));
        Long total = shoeRepository.getTotalDistanceMeters(shoeId, HyroxStation.RUN);
        return toResponse(shoe, total);
    }

    @Override
    @Transactional
    public ShoeResponse createShoe(Long userId, ShoeCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Shoe shoe = Shoe.builder()
                .user(user)
                .brand(request.brand())
                .model(request.model())
                .nickname(request.nickname())
                .initialDistanceMeters(request.initialDistanceMeters() != null ? request.initialDistanceMeters() : 0)
                .maxDistanceMeters(request.maxDistanceMeters())
                .active(true)
                .build();

        Shoe saved = shoeRepository.save(shoe);
        Long total = shoeRepository.getTotalDistanceMeters(saved.getId(),HyroxStation.RUN);
        return toResponse(saved, total);
    }

    @Override
    @Transactional
    public ShoeResponse updateShoe(Long userId, Long shoeId, ShoeUpdateRequest request) {
        Shoe shoe = shoeRepository.findByIdAndUserId(shoeId, userId)
                .orElseThrow(() -> new NotFoundException("Shoe not found"));

        if (request.brand() != null)
            shoe.setBrand(request.brand());
        if (request.model() != null)
            shoe.setModel(request.model());
        if (request.nickname() != null)
            shoe.setNickname(request.nickname());
        if (request.initialDistanceMeters() != null)
            shoe.setInitialDistanceMeters(request.initialDistanceMeters());
        if (request.maxDistanceMeters() != null)
            shoe.setMaxDistanceMeters(request.maxDistanceMeters());
        if (request.active() != null)
            shoe.setActive(request.active());

        Shoe saved = shoeRepository.save(shoe);
        Long total = shoeRepository.getTotalDistanceMeters(saved.getId(), HyroxStation.RUN);
        return toResponse(saved, total);
    }

    @Override
    @Transactional
    public void deleteShoe(Long userId, Long shoeId) {
        if (!shoeRepository.existsByIdAndUserId(shoeId, userId)) {
            throw new NotFoundException("Shoe not found");
        }
        shoeRepository.deleteById(shoeId);
    }

    private ShoeResponse toResponse(Shoe shoe, Long totalDistance) {
        if (totalDistance == null) {
            totalDistance = (long) shoe.getInitialDistanceMeters();
        }

        Integer percentage = null;
        if (shoe.getMaxDistanceMeters() != null && shoe.getMaxDistanceMeters() > 0) {
            percentage = (int) ((totalDistance * 100) / shoe.getMaxDistanceMeters());
        }

        return new ShoeResponse(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getNickname(),
                shoe.isActive(),
                shoe.getInitialDistanceMeters(),
                shoe.getMaxDistanceMeters(),
                totalDistance,
                percentage);
    }

    private ShoeSummaryResponse toSummaryResponse(Shoe shoe) {
        return new ShoeSummaryResponse(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getNickname());
    }
}