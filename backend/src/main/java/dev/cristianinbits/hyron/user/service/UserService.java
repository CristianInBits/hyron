package dev.cristianinbits.hyron.user.service;

import java.util.List;

import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);
}
