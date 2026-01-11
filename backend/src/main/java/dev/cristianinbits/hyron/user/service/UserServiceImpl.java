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

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

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

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));
        return toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::toResponse);
    }

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

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));
        userRepository.delete(user);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeName(String name) {
        return name.trim();
    }
    
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRegisteredAt()
        );
    }
}