package dev.cristianinbits.hyron.user.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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

import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;
import dev.cristianinbits.hyron.user.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

/**
 * REST controller responsible for user-related HTTP endpoints.
 *
 * Exposes CRUD operations for users and delegates business logic
 * to the {@link UserService}. Request validation is enforced at
 * the controller level using Bean Validation.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    /**
     * Creates a new user.
     *
     * @param request the user creation payload
     * @return the created user representation
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody UserCreateRequest request) {
        return userService.createUser(request);
    }

    /**
     * Retrieves a paginated list of users.
     *
     * By default, results are sorted by registration timestamp
     * in descending order.
     *
     * @param pageable pagination and sorting configuration
     * @return a page of user representations
     */
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

    /**
     * Retrieves a user by its identifier.
     *
     * @param id the user identifier
     * @return the user representation
     */
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable @Positive Long id) {
        return userService.getUserById(id);
    }

    /**
     * Partially updates an existing user.
     *
     * Only the fields provided in the request will be updated.
     *
     * @param id the user identifier
     * @param request the update payload
     * @return the updated user representation
     */
    @PatchMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        return userService.updateUser(id, request);
    }

    /**
     * Deletes a user by its identifier.
     *
     * @param id the user identifier
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable @Positive Long id) {
        userService.deleteUser(id);
    }
}