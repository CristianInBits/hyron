package dev.cristianinbits.hyron.user.dto;

import dev.cristianinbits.hyron.common.validation.NullOrNotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * Request DTO used to update an existing user.
 *
 * All fields are optional. At least one field must be provided
 * to perform an update operation.
 *
 * Validation constraints ensure that, when present, the values
 * are not blank and comply with size and format rules.
 */
public record UserUpdateRequest(

    /**
     * Updated name of the user.
     *
     * When provided, it must not be blank and is limited to 100 characters.
     */
    @NullOrNotBlank
    @Size(max = 100)
    String name,

    /**
     * Updated email address of the user.
     *
     * When provided, it must not be blank, must be a valid email format
     * and is limited to 255 characters.
     */
    @NullOrNotBlank
    @Email
    @Size(max = 255)
    String email
) { }