package dev.cristianinbits.hyron.run.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.hyrox.domain.HyroxBlock;
import dev.cristianinbits.hyron.hyrox.domain.HyroxBlockItem;
import dev.cristianinbits.hyron.hyrox.domain.HyroxRunSegment;
import dev.cristianinbits.hyron.hyrox.domain.HyroxStationEntry;
import dev.cristianinbits.hyron.hyrox.domain.HyroxWorkoutDetails;
import dev.cristianinbits.hyron.hyrox.domain.ItemType;

import dev.cristianinbits.hyron.hyrox.dto.request.HyroxBlockItemRequest;
import dev.cristianinbits.hyron.hyrox.dto.request.HyroxBlockRequest;
import dev.cristianinbits.hyron.hyrox.dto.request.HyroxRunSegmentRequest;
import dev.cristianinbits.hyron.hyrox.dto.request.HyroxStationEntryRequest;
import dev.cristianinbits.hyron.hyrox.dto.request.HyroxWorkoutDetailsCreateRequest;

import dev.cristianinbits.hyron.hyrox.dto.response.HyroxBlockItemResponse;
import dev.cristianinbits.hyron.hyrox.dto.response.HyroxBlockResponse;
import dev.cristianinbits.hyron.hyrox.dto.response.HyroxRunSegmentResponse;
import dev.cristianinbits.hyron.hyrox.dto.response.HyroxStationEntryResponse;
import dev.cristianinbits.hyron.hyrox.dto.response.HyroxWorkoutDetailsResponse;

import dev.cristianinbits.hyron.hyrox.repo.HyroxWorkoutDetailsRepository;
import dev.cristianinbits.hyron.hyrox.service.HyroxWorkoutService;

import dev.cristianinbits.hyron.workout.domain.Workout;
import dev.cristianinbits.hyron.workout.repo.WorkoutRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HyroxWorkoutServiceImpl implements HyroxWorkoutService {

    private final HyroxWorkoutDetailsRepository hyroxWorkoutDetailsRepository;
    private final WorkoutRepository workoutRepository;

    @Override
    public HyroxWorkoutDetailsResponse createOrReplaceHyroxDetails(HyroxWorkoutDetailsCreateRequest request) {

        Long workoutId = request.workoutId();

        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new EntityNotFoundException("Workout not found with id " + workoutId));

        // Si ya existen detalles Hyrox para este workout, los eliminamos (reemplazo
        // completo)
        hyroxWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .ifPresent(existing -> hyroxWorkoutDetailsRepository.delete(existing));

        HyroxWorkoutDetails details = new HyroxWorkoutDetails();
        details.setWorkout(workout);
        details.setFormat(request.format());
        details.setStrategyNotes(request.strategyNotes());

        // Mapear bloques + items (incluyendo segmentos de carrera y estaciones)
        List<HyroxBlock> blocks = request.blocks().stream()
                .map(blockRequest -> toBlockEntity(blockRequest, details))
                .toList();

        details.setBlocks(blocks);

        HyroxWorkoutDetails saved = hyroxWorkoutDetailsRepository.save(details);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public HyroxWorkoutDetailsResponse getHyroxDetailsByWorkoutId(Long workoutId) {

        HyroxWorkoutDetails details = hyroxWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new EntityNotFoundException("Hyrox details not found for workout id " + workoutId));

        return toResponse(details);
    }

    @Override
    public void deleteHyroxDetailsWorkoutById(Long workoutId) {

        HyroxWorkoutDetails details = hyroxWorkoutDetailsRepository.findByWorkoutId(workoutId)
                .orElseThrow(() -> new EntityNotFoundException("Hyrox details not found for workout id " + workoutId));

        hyroxWorkoutDetailsRepository.delete(details);
    }

    // --------------- mapping: DTO -> entidades ---------------

    private HyroxBlock toBlockEntity(HyroxBlockRequest request, HyroxWorkoutDetails details) {

        HyroxBlock block = new HyroxBlock();

        block.setWorkoutDetails(details);
        block.setOrderIndex(request.orderIndex());
        block.setRestAfterBlockSec(request.restAfterBlockSec());
        block.setRestBeforeBlockSec(request.restBeforeBlockSec());
        block.setNotes(request.notes());

        List<HyroxBlockItem> items = request.items().stream()
                .map(itemRequest -> toBlockItemEntity(itemRequest, block))
                .toList();

        block.setItems(items);

        return block;
    }

    private HyroxBlockItem toBlockItemEntity(HyroxBlockItemRequest request, HyroxBlock block) {

        HyroxBlockItem item = new HyroxBlockItem();

        item.setBlock(block);
        item.setOrderIndex(request.orderIndex());
        item.setItemType(request.itemType());
        item.setRestBeforeItemSec(request.restBeforeItemSec());
        item.setRestAfterItemSec(request.restAfterItemSec());

        // Validamos coherencia RUN/STATION vs DTOs adjuntos
        if (request.itemType() == ItemType.RUN) {

            if (request.runSegment() == null) {
                throw new IllegalArgumentException("HyroxBlockItem of type RUN must include runSegment");
            }

            if (request.stationEntry() != null) {
                throw new IllegalArgumentException("HyroxBlockItem of type RUN cannot include stationEntry");
            }

            HyroxRunSegment segment = toRunSegmentEntity(request.runSegment(), item);
            item.setRunSegment(segment);

        } else if (request.itemType() == ItemType.STATION) {

            if (request.stationEntry() == null) {
                throw new IllegalArgumentException("HyroxBlockItem of type STATION must include stationEntry");
            }

            if (request.runSegment() != null) {
                throw new IllegalArgumentException("HyroxBlockItem of type STATION cannot include runSegment");
            }

            HyroxStationEntry entry = toStationEntryEntity(request.stationEntry(), item);
            item.setStationEntry(entry);
        }

        return item;
    }

    private HyroxRunSegment toRunSegmentEntity(HyroxRunSegmentRequest request, HyroxBlockItem item) {

        HyroxRunSegment segment = new HyroxRunSegment();

        segment.setBlockItem(item);
        segment.setDistance(request.distance());
        segment.setDurationSec(request.durationSec());
        segment.setAveragePace(request.averagePace());
        segment.setAverageHr(request.averageHr());
        segment.setNotes(request.notes());

        return segment;
    }

    private HyroxStationEntry toStationEntryEntity(HyroxStationEntryRequest request, HyroxBlockItem item) {

        HyroxStationEntry entry = new HyroxStationEntry();

        entry.setBlockItem(item);
        entry.setStation(request.station());
        entry.setDurationSec(request.durationSec());
        entry.setRpe(request.rpe());
        entry.setReps(request.reps());
        entry.setDistance(request.distance());
        entry.setTotalWeight(request.totalWeight());
        entry.setAveragePower(request.averagePower());
        entry.setAverageHr(request.averageHr());
        entry.setNotes(request.notes());

        return entry;
    }

    // ---------- mapping: entidades -> DTOs ----------

    private HyroxWorkoutDetailsResponse toResponse(HyroxWorkoutDetails details) {

        List<HyroxBlockResponse> blockResponses = details.getBlocks().stream()
                .sorted(Comparator.comparing(HyroxBlock::getOrderIndex))
                .map(this::toBlockResponse)
                .toList();

        return new HyroxWorkoutDetailsResponse(
                details.getId(),
                details.getWorkout().getId(),
                details.getFormat(),
                details.getStrategyNotes(),
                blockResponses
        );
    }

    private HyroxBlockResponse toBlockResponse(HyroxBlock block) {

        List<HyroxBlockItemResponse> itemResponses = block.getItems().stream()
                .sorted(Comparator.comparing(HyroxBlockItem::getOrderIndex))
                .map(this::toBlockItemResponse)
                .toList();

        return new HyroxBlockResponse(
                block.getId(),
                block.getOrderIndex(),
                block.getRestBeforeBlockSec(),
                block.getRestAfterBlockSec(),
                block.getNotes(),
                itemResponses
        );
    }

    private HyroxBlockItemResponse toBlockItemResponse(HyroxBlockItem item) {
        HyroxRunSegmentResponse runSegmentResponse = null;
        HyroxStationEntryResponse stationEntryResponse = null;

        if (item.getRunSegment() != null) {
            runSegmentResponse = toRunSegmentResponse(item.getRunSegment());
        }
        if (item.getStationEntry() != null) {
            stationEntryResponse = toStationEntryResponse(item.getStationEntry());
        }

        return new HyroxBlockItemResponse(
                item.getId(),
                item.getOrderIndex(),
                item.getItemType(),
                item.getRestBeforeItemSec(),
                item.getRestAfterItemSec(),
                runSegmentResponse,
                stationEntryResponse
        );
    }

    private HyroxRunSegmentResponse toRunSegmentResponse(HyroxRunSegment segment) {

        return new HyroxRunSegmentResponse(
                segment.getId(),
                segment.getDistance(),
                segment.getDurationSec(),
                segment.getAveragePace(),
                segment.getAverageHr(),
                segment.getNotes()
        );
    }

    private HyroxStationEntryResponse toStationEntryResponse(HyroxStationEntry entry) {

        return new HyroxStationEntryResponse(
                entry.getId(),
                entry.getStation(),
                entry.getDurationSec(),
                entry.getRpe(),
                entry.getReps(),
                entry.getDistance(),
                entry.getTotalWeight(),
                entry.getAveragePower(),
                entry.getAverageHr(),
                entry.getNotes()
        );
    }
}
