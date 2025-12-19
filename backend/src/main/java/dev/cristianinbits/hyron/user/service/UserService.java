package dev.cristianinbits.hyron.user.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;

/**
 * Service contract for user management operations.
 *
 * Defines the main use cases related to users, including creation, retrieval,
 * listing, update and deletion. Implementations are responsible for enforcing
 * business rules (such as email uniqueness) and for returning API-facing DTOs.
 */
public interface UserService {

    /**
     * Creates a new user.
     *
     * Implementations must enforce email uniqueness and apply any required
     * normalization rules before persisting the user.
     *
     * @param request the user creation data
     * @return the created user representation
     * @throws ConflictException if the email address is already in use
     */
    UserResponse createUser(UserCreateRequest request);

    /**
     * Retrieves a user by its identifier.
     *
     * @param id the user identifier
     * @return the user representation
     * @throws NotFoundException if no user exists with the given id
     */
    UserResponse getUserById(Long id);

    /**
     * Retrieves a paginated list of users.
     *
     * @param pageable pagination and sorting configuration
     * @return a page of user representations
     */
    Page<UserResponse> getAllUsers(Pageable pageable);

    /**
     * Updates an existing user.
     *
     * Fields are optional; at least one field must be provided.
     * Implementations must enforce email uniqueness when the email is changed
     * and apply any required normalization rules.
     *
     * @param id the user identifier
     * @param request the update payload
     * @return the updated user representation
     * @throws NotFoundException if no user exists with the given id
     * @throws BadRequestException if no fields are provided to update
     * @throws ConflictException if the new email address is already in use
     */
    UserResponse updateUser(Long id, UserUpdateRequest request);

    /**
     * Deletes a user by its identifier.
     *
     * @param id the user identifier
     * @throws NotFoundException if no user exists with the given id
     */
    void deleteUser(Long id);
}