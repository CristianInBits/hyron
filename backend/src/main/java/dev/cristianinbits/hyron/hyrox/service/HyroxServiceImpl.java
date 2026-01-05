package dev.cristianinbits.hyron.hyrox.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.ConflictException;
import dev.cristianinbits.hyron.common.exception.NotFoundException;

import dev.cristianinbits.hyron.hyrox.domain.HyroxBlock;
import dev.cristianinbits.hyron.hyrox.domain.HyroxItem;
import dev.cristianinbits.hyron.hyrox.domain.HyroxStation;
import dev.cristianinbits.hyron.hyrox.domain.HyroxWorkoutDetails;

import dev.cristianinbits.hyron.hyrox.dto.HyroxBlockRequest;
import dev.cristianinbits.hyron.hyrox.dto.HyroxBlockResponse;
import dev.cristianinbits.hyron.hyrox.dto.HyroxDetailsCreateRequest;
import dev.cristianinbits.hyron.hyrox.dto.HyroxDetailsResponse;
import dev.cristianinbits.hyron.hyrox.dto.HyroxItemRequest;
import dev.cristianinbits.hyron.hyrox.dto.HyroxItemResponse;

import dev.cristianinbits.hyron.hyrox.repo.HyroxWorkoutDetailsRepository;
import dev.cristianinbits.hyron.shoe.domain.Shoe;
import dev.cristianinbits.hyron.shoe.dto.ShoeSummaryResponse;
import dev.cristianinbits.hyron.shoe.repo.ShoeRepository;
import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HyroxServiceImpl implements HyroxService {

    private final HyroxWorkoutDetailsRepository hyroxRepository;
    private final WorkoutRepository workoutRepository;
    private final ShoeRepository shoeRepository;

    @Override
    @Transactional
    public HyroxDetailsResponse createOrUpdateDetails(Long userId, Long workoutId, HyroxDetailsCreateRequest request) {

        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new NotFoundException("Workout not found"));

        if (workout.getType() != WorkoutType.HYROX) {
            throw new ConflictException("Workout type must be HYROX but was " + workout.getType());
        }

        HyroxWorkoutDetails details = hyroxRepository.findByWorkoutId(workoutId)
                .orElseGet(() -> HyroxWorkoutDetails.builder().workout(workout).build());

        details.setNotes(normalizeString(request.notes()));

        if (request.shoeId() != null) {
            Shoe shoe = shoeRepository.findByIdAndUserId(request.shoeId(), userId)
                    .orElseThrow(() -> new NotFoundException("Shoe not found"));
            details.setShoe(shoe);
        } else {
            details.setShoe(null);
        }

        details.getBlocks().clear();
        hyroxRepository.flush();

        int blockIndex = 1;
        for (HyroxBlockRequest blockReq : request.blocks()) {
            HyroxBlock block = mapBlock(blockReq, blockIndex++);
            details.addBlock(block);
        }

        HyroxWorkoutDetails saved = hyroxRepository.save(details);
        return toResponse(saved);
    }

    @Override
    public HyroxDetailsResponse getDetails(Long userId, Long workoutId) {
        if (!workoutRepository.existsByIdAndUserId(workoutId, userId)) {
            throw new NotFoundException("Workout not found");
        }

        HyroxWorkoutDetails details = hyroxRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Hyrox details not found"));

        return toResponse(details);
    }

    @Override
    @Transactional
    public void deleteDetails(Long userId, Long workoutId) {
        if (!hyroxRepository.existsByWorkout_IdAndWorkout_User_Id(workoutId, userId)) {
            throw new NotFoundException("Hyrox details not found");
        }

        hyroxRepository.findByWorkoutId(workoutId)
                .ifPresent(hyroxRepository::delete);
    }

    // ==================== Helpers ====================

    private HyroxBlock mapBlock(HyroxBlockRequest request, int index) {
        HyroxBlock block = HyroxBlock.builder()
                .orderIndex(index)
                .restDurationSeconds(request.restDurationSeconds())
                .notes(normalizeString(request.notes()))
                .build();

        int itemIndex = 1;
        for (HyroxItemRequest itemReq : request.items()) {
            block.addItem(mapItem(itemReq, itemIndex++));
        }

        return block;
    }

    private HyroxItem mapItem(HyroxItemRequest request, int index) {
        return HyroxItem.builder()
                .orderIndex(index)
                .station(request.station())
                .durationSeconds(request.durationSeconds())
                .recoveryDurationSeconds(request.recoveryDurationSeconds())
                .distanceMeters(request.distanceMeters())
                .reps(request.reps())
                .weightKg(request.weightKg())
                .averageHr(request.averageHr())
                .rpe(request.rpe())
                .notes(normalizeString(request.notes()))
                .build();
    }

    // ==================== Mappers ====================

    private HyroxDetailsResponse toResponse(HyroxWorkoutDetails details) {
        return new HyroxDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getShoe() != null ? toSummaryResponse(details.getShoe()) : null,
                details.getNotes(),
                details.getBlocks().stream()
                        .map(this::toBlockResponse)
                        .toList());
    }

    private HyroxBlockResponse toBlockResponse(HyroxBlock block) {
        return new HyroxBlockResponse(
                block.getId(),
                block.getOrderIndex(),
                block.getRestDurationSeconds(),
                block.getNotes(),
                block.getItems().stream()
                        .map(this::toItemResponse)
                        .toList());
    }

    private HyroxItemResponse toItemResponse(HyroxItem item) {
        return new HyroxItemResponse(
                item.getId(),
                item.getOrderIndex(),
                item.getStation(),
                item.getDurationSeconds(),
                item.getRecoveryDurationSeconds(),
                item.getDistanceMeters(),
                item.getReps(),
                item.getWeightKg(),
                item.getAverageHr(),
                item.getRpe(),
                item.getNotes(),
                calculatePace(item));
    }

    private Integer calculatePace(HyroxItem item) {
        if (item.getStation() != HyroxStation.RUN && item.getStation() != HyroxStation.ROW) {
            return null;
        }
        if (item.getDistanceMeters() == null || item.getDistanceMeters() == 0 || item.getDurationSeconds() == null) {
            return null;
        }
        return (item.getDurationSeconds() * 1000) / item.getDistanceMeters();
    }

    private String normalizeString(String value) {
        return (value != null && !value.isBlank()) ? value.trim() : null;
    }

    private ShoeSummaryResponse toSummaryResponse(Shoe shoe) {
        return new ShoeSummaryResponse(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getNickname());
    }
}