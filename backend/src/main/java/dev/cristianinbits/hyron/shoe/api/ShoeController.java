package dev.cristianinbits.hyron.shoe.api;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import dev.cristianinbits.hyron.shoe.dto.ShoeCreateRequest;
import dev.cristianinbits.hyron.shoe.dto.ShoeResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeSummaryResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeUpdateRequest;
import dev.cristianinbits.hyron.shoe.service.ShoeService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{userId}/shoes")
@RequiredArgsConstructor
@Validated
public class ShoeController {

    private final ShoeService shoeService;

    @PostMapping
    public ResponseEntity<ShoeResponse> createShoe(
            @PathVariable @Positive Long userId,
            @Valid @RequestBody ShoeCreateRequest request) {
        ShoeResponse created = shoeService.createShoe(userId, request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/{id}")
    public ShoeResponse getShoe(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id) {
        return shoeService.getShoe(userId, id);
    }

    @GetMapping
    public List<ShoeResponse> getAllShoes(
            @PathVariable @Positive Long userId) {
        return shoeService.getAllShoes(userId);
    }

    @GetMapping("/active/summary")
    public List<ShoeSummaryResponse> getActiveShoesForSelect(@PathVariable @Positive Long userId) {
        return shoeService.getActiveShoesForSelect(userId);
    }

    @PatchMapping("/{id}")
    public ShoeResponse updateShoe(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id,
            @Valid @RequestBody ShoeUpdateRequest request) {
        return shoeService.updateShoe(userId, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShoe(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long id) {
        shoeService.deleteShoe(userId, id);
    }
}