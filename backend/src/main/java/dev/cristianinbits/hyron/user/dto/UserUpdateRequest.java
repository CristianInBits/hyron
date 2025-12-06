package dev.cristianinbits.hyron.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(

        @Size(max = 100)
        String name,

        @Email 
        @Size(max = 255)
        String email
) { }
