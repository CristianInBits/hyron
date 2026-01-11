package dev.cristianinbits.hyron.user.api;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;
import dev.cristianinbits.hyron.user.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        UserResponse created = userService.createUser(request);

        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.id())
            .toUri();

        return ResponseEntity.created(location).body(created);
    }

    @GetMapping
    public Page<UserResponse> getAllUsers(
            @PageableDefault(
                    size = 20,
                    sort = "registeredAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return userService.getAllUsers(pageable);
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable @Positive Long id) {
        return userService.getUserById(id);
    }

    @PatchMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        return userService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable @Positive Long id) {
        userService.deleteUser(id);
    }
}