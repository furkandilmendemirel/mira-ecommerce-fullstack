package com.mira.api.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "E-posta zorunludur")
        @Email(message = "Geçerli bir e-posta adresi girilmelidir")
        String email,

        @NotBlank(message = "Şifre zorunludur")
        String password
) {
}
