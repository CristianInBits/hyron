package dev.cristianinbits.hyron.user.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.common.exception.BadRequestException;
import dev.cristianinbits.hyron.common.exception.ConflictException;
import dev.cristianinbits.hyron.common.exception.NotFoundException;
import dev.cristianinbits.hyron.user.domain.User;
import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;
import dev.cristianinbits.hyron.user.repo.UserRepository;

import lombok.RequiredArgsConstructor;
import java.util.Locale;

/**
 * Default implementation of {@link UserService}.
 *
 * Handles user-related business logic, including input normalization and
 * enforcement of email uniqueness. All operations return DTOs intended for
 * exposure through the API layer.
 *
 * Transaction management:
 * - Write operations run within a transactional context.
 * - Read operations are executed as read-only transactions.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    /**
     * Creates a new user after normalizing input and verifying email uniqueness.
     *
     * @param request the user creation data
     * @return the created user representation
     * @throws ConflictException if the email address is already in use
     */
    @Override
    public UserResponse createUser(UserCreateRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ConflictException("Email already in use: " + normalizedEmail);
        }

        User user = new User();
        user.setName(normalizeName(request.name()));
        user.setEmail(normalizedEmail);

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    /**
     * Retrieves a user by id.
     *
     * @param id the user identifier
     * @return the user representation
     * @throws NotFoundException if no user exists with the given id
     */
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));
        return toResponse(user);
    }

    /**
     * Retrieves a paginated list of users.
     *
     * @param pageable pagination and sorting configuration
     * @return a page of user representations
     */
    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::toResponse);
    }

    /**
     * Updates an existing user.
     *
     * Performs a partial update based on non-null fields in the request.
     * If an email change is requested, email uniqueness is validated excluding
     * the current user.
     *
     * @param id the user identifier
     * @param request the update payload
     * @return the updated user representation
     * @throws NotFoundException if no user exists with the given id
     * @throws BadRequestException if no fields are provided to update
     * @throws ConflictException if the new email address is already in use
     */
    @Override
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));

        if (request.name() == null && request.email() == null) {
            throw new BadRequestException("No fields provided to update");
        }

        if (request.email() != null) {
            String normalizedEmail = normalizeEmail(request.email());

            if (!normalizedEmail.equals(user.getEmail())) {
                if (userRepository.existsByEmailAndIdNot(normalizedEmail, id)) {
                    throw new ConflictException("Email already in use: " + normalizedEmail);
                }
                user.setEmail(normalizedEmail);
            }
        }

        if (request.name() != null) {
            user.setName(normalizeName(request.name()));
        }

        return toResponse(userRepository.save(user));
    }

    /**
     * Deletes an existing user.
     *
     * @param id the user identifier
     * @throws NotFoundException if no user exists with the given id
     */
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));
        userRepository.delete(user);
    }

    /**
     * Normalizes an email address for consistent storage and comparison.
     *
     * @param email the raw email value
     * @return the normalized email
     */
    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    /**
     * Normalizes a user name for consistent storage.
     *
     * @param name the raw name value
     * @return the normalized name
     */
    private String normalizeName(String name) {
        return name.trim();
    }

    /**
     * Maps a {@link User} entity to a {@link UserResponse} DTO.
     *
     * @param user the source entity
     * @return the API-facing representation
     */
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRegisteredAt()
        );
    }
}