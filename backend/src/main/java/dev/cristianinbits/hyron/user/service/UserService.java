package dev.cristianinbits.hyron.user.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    UserResponse getUserById(Long id);

    Page<UserResponse> getAllUsers(Pageable pageable);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);
}