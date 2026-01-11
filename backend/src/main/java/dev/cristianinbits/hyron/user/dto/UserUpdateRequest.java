package dev.cristianinbits.hyron.user.dto;

import java.util.Locale;

import dev.cristianinbits.hyron.common.validation.NullOrNotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(

    @NullOrNotBlank
    @Size(max = 100)
    String name,

    @NullOrNotBlank
    @Email
    @Size(max = 255)
    String email
) { 
    public UserUpdateRequest {
        if (name != null) name = name.trim();
        if (email != null) email = email.trim().toLowerCase(Locale.ROOT);
    }
}