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

import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.domain.WorkoutType;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HyroxServiceImpl implements HyroxService {

    private final HyroxWorkoutDetailsRepository hyroxRepository;
    private final WorkoutRepository workoutRepository;

    @Override
    public HyroxDetailsResponse createOrUpdateDetails(Long userId, Long workoutId, HyroxDetailsCreateRequest request) {

        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new NotFoundException("Workout not found"));

        if (workout.getType() != WorkoutType.HYROX) {
            throw new ConflictException("Workout type must be HYROX but was " + workout.getType());
        }

        HyroxWorkoutDetails details = hyroxRepository.findByWorkoutId(workoutId)
            .orElseGet(() -> HyroxWorkoutDetails.builder().workout(workout).build());

        details.setNotes(normalizeString(request.notes()));
        details.getBlocks().clear();

        int blockIndex = 0;
        for (HyroxBlockRequest blockReq : request.blocks()) {
            HyroxBlock block = mapBlock(blockReq, blockIndex++);
            details.addBlock(block);
        }

        HyroxWorkoutDetails saved = hyroxRepository.save(details);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public HyroxDetailsResponse getDetails(Long userId, Long workoutId) {
        if (!workoutRepository.existsByIdAndUserId(workoutId, userId)) {
            throw new NotFoundException("Workout not found");
        }

        HyroxWorkoutDetails details = hyroxRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new NotFoundException("Hyrox details not found"));

        return toResponse(details);
    }

    @Override
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
                .restDuration(request.restDuration())
                .notes(normalizeString(request.notes()))
                .build();

        int itemIndex = 0;
        for (HyroxItemRequest itemReq : request.items()) {
            block.addItem(mapItem(itemReq, itemIndex++));
        }

        return block;
    }

    private HyroxItem mapItem(HyroxItemRequest request, int index) {
        return HyroxItem.builder()
                .orderIndex(index)
                .station(request.station())
                .duration(request.duration())
                .recoveryDuration(request.recoveryDuration())
                .distance(request.distance())
                .reps(request.reps())
                .weight(request.weight())
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
                details.getNotes(),
                details.getBlocks().stream()
                        .map(this::toBlockResponse)
                        .toList()
        );
    }

    private HyroxBlockResponse toBlockResponse(HyroxBlock block) {
        return new HyroxBlockResponse(
                block.getId(),
                block.getOrderIndex(),
                block.getRestDuration(),
                block.getNotes(),
                block.getItems().stream()
                        .map(this::toItemResponse)
                        .toList()
        );
    }

    private HyroxItemResponse toItemResponse(HyroxItem item) {
        return new HyroxItemResponse(
                item.getId(),
                item.getOrderIndex(),
                item.getStation(),
                item.getDuration(),
                item.getRecoveryDuration(),
                item.getDistance(),
                item.getReps(),
                item.getWeight(),
                item.getAverageHr(),
                item.getRpe(),
                item.getNotes(),
                calculatePace(item)
        );
    }

    private Integer calculatePace(HyroxItem item) {
        if (item.getStation() != HyroxStation.RUN && item.getStation() != HyroxStation.ROW) {
            return null;
        }
        if (item.getDistance() == null || item.getDistance() == 0 || item.getDuration() == null) {
            return null;
        }
        return (item.getDuration() * 1000) / item.getDistance();
    }

    private String normalizeString(String value) {
        return (value != null && !value.isBlank()) ? value.trim() : null;
    }
}