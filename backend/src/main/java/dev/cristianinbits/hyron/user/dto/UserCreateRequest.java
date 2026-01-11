package dev.cristianinbits.hyron.user.dto;

import java.util.Locale;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(

    @NotBlank
    @Size(max = 100)
    String name,

    @NotBlank
    @Email
    @Size(max = 255)
    String email

) { 
    public UserCreateRequest {
        name = name.strip();
        email = email.trim().toLowerCase(Locale.ROOT);
    }
}