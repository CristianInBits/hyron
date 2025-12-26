package dev.cristianinbits.hyron.user.dto;

import java.util.Locale;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO used to create a new user.
 *
 * This object contains the mandatory data required to register a user.
 * Validation constraints ensure that the provided values are not blank
 * and comply with the defined size and format rules.
 */
public record UserCreateRequest(

    /**
     * Name of the user.
     *
     * Must not be blank and is limited to 100 characters.
     */
    @NotBlank
    @Size(max = 100)
    String name,

    /**
     * Email address of the user.
     *
     * Must not be blank, must be a valid email format
     * and is limited to 255 characters.
     */
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