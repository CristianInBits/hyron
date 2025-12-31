package dev.cristianinbits.hyron.exercise.api;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import dev.cristianinbits.hyron.exercise.dto.ExerciseCreateRequest;
import dev.cristianinbits.hyron.exercise.dto.ExerciseResponse;
import dev.cristianinbits.hyron.exercise.dto.ExerciseSummaryResponse;
import dev.cristianinbits.hyron.exercise.dto.ExerciseUpdateRequest;
import dev.cristianinbits.hyron.exercise.service.ExerciseService;
import dev.cristianinbits.hyron.gym.domain.MuscleGroup;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{userId}/exercises")
@RequiredArgsConstructor
@Validated
public class ExerciseController {

    private final ExerciseService exerciseService;

    @PostMapping
    public ResponseEntity<ExerciseResponse> createExercise(
            @PathVariable @Positive Long userId,
            @Valid @RequestBody ExerciseCreateRequest request
    ) {
        ExerciseResponse created = exerciseService.createExercise(userId, request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/{id}")
    public ExerciseResponse getExercise(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id
    ) {
        return exerciseService.getExercise(userId, id);
    }

    @GetMapping
    public List<ExerciseResponse> getAllExercises(
            @PathVariable @Positive Long userId
    ) {
        return exerciseService.getAllExercises(userId);
    }

    @GetMapping("/active")
    public List<ExerciseSummaryResponse> getActiveExercises(
            @PathVariable @Positive Long userId,
            @RequestParam(required = false) MuscleGroup muscleGroup
    ) {
        if (muscleGroup != null) {
            return exerciseService.getActiveExercisesByMuscleGroup(userId, muscleGroup);
        }
        return exerciseService.getActiveExercises(userId);
    }

    @PatchMapping("/{id}")
    public ExerciseResponse updateExercise(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id,
            @Valid @RequestBody ExerciseUpdateRequest request
    ) {
        return exerciseService.updateExercise(userId, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExercise(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id
    ) {
        exerciseService.deleteExercise(userId, id);
    }
}